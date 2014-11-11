/* ------------
Kernel.ts
Requires globals.ts
Routines for the Operating System, NOT the host.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            readyQueue = new TSOS.Queue();
            residentQueue = new Array();
            scheduler = new TSOS.Scheduler();

            // Initialize the console.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };

        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");

            // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();

            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };

        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware sim every time there is a hardware clock pulse.
            This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
            This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel
            that it has to look for interrupts and process them if it finds any.                           */
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (clockCycle >= quantum) {
                this.krnInterruptHandler(contextSwitch, 0);
                return;
            } else if (_CPU.isExecuting) {
                _CPU.cycle();
                clockCycle++;
            } else {
                this.krnTrace("Idle");
            }
        };

        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;

                case breakCall:
                    _CPU.init();
                    _CPU.showCPU();
                    process.setState(4); // set state to terminated;
                    TSOS.Shell.updateRes();
                    _Kernel.krnTrace("Terminating PID: " + process.getPID());
                    scheduler.startProcess();
                    alert("After startprocess");
                    break;

                case invalidOpCode:
                    _StdOut.putText("The input contained an invalid op code");

                    break;

                case murdered:
                    process.setState(4);
                    _Kernel.krnTrace("\n Murdered PID " + process.getPID());
                    _CPU.init();
                    _CPU.showCPU();
                    TSOS.Shell.updateRes();
                    scheduler.startProcess();
                    break;

                case newProcess:
                    scheduler.startProcess();
                    break;

                case contextSwitch:
                    //scheduler.contextSwitch();
                    // scheduler.init();
                    clockCycle = 0;
                    _CPU.showCPU();

                    // scheduler.contextSwitch()
                    if (readyQueue.isEmpty() && process.getState() == "terminated") {
                        _CPU.init();
                    } else {
                        process.setPC(_CPU.PC);
                        process.setAcc(_CPU.Acc);
                        process.setIR(_CPU.IR);
                        process.setXReg(_CPU.XReg);
                        process.setYReg(_CPU.YReg);
                        process.setZFlag(_CPU.ZFlag);
                        process.setState(2);
                        readyQueue.enqueue(process);
                        _CPU.showCPU();

                        // scheduler.contextSwitch()
                        process = readyQueue.dequeue();
                        _Kernel.krnTrace(" Context switched. Processing PID: " + process.getPID());
                        process.setState(1); // set state to running.
                        _CPU.beginProcess(process);
                        _Kernel.krnTrace("Processing PID: " + process.getPID());
                        TSOS.Shell.updateRes();
                    }
                    break;

                case sysCall:
                    // Print the contents in Y register.
                    if (_CPU.XReg == 1) {
                        // alert("syscall:"+ _CPU.YReg);
                        _StdOut.putText("" + _CPU.YReg.toString());
                        _Console.advanceLine();
                        _OsShell.putPrompt();
                    }
                    if (_CPU.XReg == 2) {
                        var x = 0;
                        var addr = parseInt(memoryMngr.readMemory(_CPU.YReg), 16);

                        while (addr != 0) {
                            // alert("addr" + addr);
                            _StdOut.putText(String.fromCharCode(addr).toString());

                            // alert(String.fromCharCode(addr).toString());
                            x++;
                            addr = parseInt(memoryMngr.readMemory(parseInt(_CPU.YReg + x)), 16);
                        }
                        _Console.advanceLine();
                        _OsShell.putPrompt();
                    }
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };

        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                } else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };

        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);

            //_Console.ifError();
            // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
            this.krnShutdown();
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
