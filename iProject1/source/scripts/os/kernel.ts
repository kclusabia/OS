/* ------------
     Kernel.ts

     Requires globals.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Kernel {
        //
        // OS Startup and Shutdown Routines
        //
        public krnBootstrap() {      // Page 8. {
            Control.hostLog("bootstrap", "host");  // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new Queue();  // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array();         // Buffers... for the kernel.
            _KernelInputQueue = new Queue();      // Where device input lands before being processed out somewhere.
            _Console = new Console();          // The command line interface / console I/O device.
            readyQueue = new Queue();
            residentQueue = new Array();
            scheduler = new Scheduler();

            // Initialize the console.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn  = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();     // Construct it.
            _krnKeyboardDriver.driverEntry();                    // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //

            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown() {
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
        }


        public krnOnCPUClockPulse() {
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
            } else if (clockCycle >= quantum) { // If there are no interrupts then run one CPU cycle if there is anything being processed. {
               this.krnInterruptHandler(contextSwitch,0);
                return;
                // only perform context switch when quantum has expired.
            }
            else if(_CPU.isExecuting) {
                _CPU.cycle();
                clockCycle++;
            }
//            else if (readyQueue.getSize() > 0) {
//                //_KernelInterruptQueue.enqueue(new Interrupt(contextSwitch, 5));
//                process = readyQueue.dequeue();
//                _CPU.isExecuting = true;
//                _CPU.PC = process.getBase();
//                process.setState(1);
//                Shell.updateRes();
//                _CPU.showCPU();
//            }
            else {                      // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
            }
        }

        //
        // Interrupt Handling
        //
        public krnEnableInterrupts() {
            // Keyboard
            Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        }

        public krnDisableInterrupts() {
            // Keyboard
            Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        }

        public krnInterruptHandler(irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            _Mode = 0;
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();              // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);   // Kernel mode device driver
                    _StdIn.handleInput();
                    break;

                case breakCall:
                    _CPU.init();
                    _CPU.showCPU();
                    process.setState(4);        // set state to terminated;
                    Shell.updateRes();
                    _Kernel.krnTrace("Terminating PID: " + process.getPID());
                    scheduler.startProcess();
                    alert("After startprocess");
                    break;

                case invalidOpCode:
                    _StdOut.putText("The input contained an invalid op code");
//                    _CPU.init();
//                    _Console.advanceLine();
//                    _OsShell.putPrompt();
                    break;

                case murdered:
                    _Kernel.krnTrace("Murdered PID " + params.getPID());
                   // _CPU.init();
                  //  _CPU.showCPU();
                    Shell.updateRes();
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
                    }
                    else {
                        process.setPC(_CPU.PC);
                        process.setAcc(_CPU.Acc);
                        process.setIR(_CPU.IR);
                        process.setXReg(_CPU.XReg);
                        process.setYReg(_CPU.YReg);
                        process.setZFlag(_CPU.ZFlag);
                        process.setState(2);            // set state to waiting
                        readyQueue.enqueue(process);
                        _CPU.showCPU();

                        // scheduler.contextSwitch()
                        process = readyQueue.dequeue();
                        if (process.getState() == "terminated") {
                            scheduler.init();
                            scheduler.startProcess();
                        }
                            _Kernel.krnTrace(" Context switched. Processing PID: " + process.getPID());
                            process.setState(1);            // set state to running.
                            _CPU.beginProcess(process);
                            _Kernel.krnTrace("Processing PID: " + process.getPID());
                            Shell.updateRes();
                    }
                    break;

                // Indicates a system call interrupt.
                case sysCall:
                    // Print the contents in Y register.
                    if(_CPU.XReg == 1) {
                       // alert("syscall:"+ _CPU.YReg);
                        _StdOut.putText("" + _CPU.YReg.toString());
                        _Console.advanceLine();
                        _OsShell.putPrompt();
                    }
                    if (_CPU.XReg == 2) {
                        var x = 0;
                        var addr = parseInt(memoryMngr.readMemory(_CPU.YReg), 16);
                      //  alert("Yreg: " + _CPU.YReg);
                       // alert("Address in FF is: "+(addr) +" PID: "+ process.getPID() + " PC: "+parseInt(process.getBase()+_CPU.PC));
                        while ( addr != 0 ) {
                           // alert("addr" + addr);
                            _StdOut.putText(String.fromCharCode(addr).toString());
                          // alert(String.fromCharCode(addr).toString());
                            x++;
                            addr = parseInt(memoryMngr.readMemory(parseInt(_CPU.YReg+x)),16);
                        }
                        _Console.advanceLine();
                        _OsShell.putPrompt();
                    }
                    break;

                case memoryBounded:
                    _CPU.init();
                    scheduler.init();
                    scheduler.startProcess();

                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
            _Mode = 1;
        }

        public krnTimerISR() {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        }

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
        public krnTrace(msg: string) {
             // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
             if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        Control.hostLog(msg, "OS");
                    }
                } else {
                    Control.hostLog(msg, "OS");
                }
             }
        }

        public krnTrapError(msg) {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            //_Console.ifError();

            // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
            this.krnShutdown();
        }
    }
}
