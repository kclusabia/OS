///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, IR, XReg, YReg, ZFlag, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof IR === "undefined") { IR = ""; }
            if (typeof XReg === "undefined") { XReg = 0; }
            if (typeof YReg === "undefined") { YReg = 0; }
            if (typeof ZFlag === "undefined") { ZFlag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.IR = IR;
            this.XReg = XReg;
            this.YReg = YReg;
            this.ZFlag = ZFlag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.IR = "";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // Goes through all the opcodes.
            _CPU.runOpCode(memory.readMem(_CPU.PC));

            // Updates the CPU block.
            _CPU.showCPU();

            // Redraws the PCB.
            pcb.showPCB();

            // Updates the PCB.
            pcb.updatePCB();
        };

        // The CPU block
        Cpu.prototype.showCPU = function () {
            document.getElementById("PC").innerHTML = String(this.PC);
            document.getElementById("Acc").innerHTML = this.Acc.toString();
            document.getElementById("IR").innerHTML = String(this.IR);
            document.getElementById("XReg").innerHTML = String(this.XReg);
            document.getElementById("YReg").innerHTML = String(this.YReg);
            document.getElementById("ZFlag").innerHTML = String(this.ZFlag);
        };

        // Lists all the opcodes.
        Cpu.prototype.runOpCode = function (opcode) {
            opcode = opcode.toString().toUpperCase();
            this.IR = opcode;

            if (opcode == "A9") {
                this.loadAccConstant();
            } else if (opcode == "AD") {
                this.loadAccMem();
            } else if (opcode == "8D") {
                this.storeAccMem();
            } else if (opcode == "6D") {
                this.addWithCarry();
            } else if (opcode == "A2") {
                this.loadXRegCons();
            } else if (opcode == "AE") {
                this.loadXMem();
            } else if (opcode == "A0") {
                this.loadYRegCons();
            } else if (opcode == "AC") {
                this.loadYRegMem();
            } else if (opcode == "EA") {
                this.noOperation();
            } else if (opcode == "00") {
                this.break();
            } else if (opcode == "EC") {
                this.compareToX();
            } else if (opcode == "D0") {
                this.branchX();
            } else if (opcode == "EE") {
                this.incByteVal();
            } else if (opcode == "FF") {
                this.sysCall();
            }
        };

        // A9
        Cpu.prototype.loadAccConstant = function () {
            this.PC++;
            _CPU.Acc = parseInt(memoryMngr.readMemory(_CPU.PC), 16); //a9 11 gives 17(dec)

            // _CPU.isExecuting = false;
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // AD
        Cpu.prototype.loadAccMem = function () {
            _CPU.PC++;

            // Getting the address as hex.
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.Acc = parseInt(memoryMngr.readMemory(loc));
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // 8D
        Cpu.prototype.storeAccMem = function () {
            _CPU.PC++;

            // Storage is now read as a hex
            var storage = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            memoryMngr.storeData(storage, parseInt((_CPU.Acc), 16));
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // 6D
        Cpu.prototype.addWithCarry = function () {
            this.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var value = parseInt(memoryMngr.readMemory(loc));

            // Changed to string to change its base to hex.
            var acc = parseInt(this.Acc.toString(), 16);
            _CPU.Acc = value + acc;
            _CPU.PC++;
        };

        // A2
        Cpu.prototype.loadXRegCons = function () {
            _CPU.PC++;
            _CPU.XReg = parseInt(memory.readMem(_CPU.PC.toString()), 16);

            //_CPU.isExecuting = false;
            _CPU.PC++;
        };

        // AE
        Cpu.prototype.loadXMem = function () {
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.XReg = parseInt(memoryMngr.readMemory(loc.toString()), 16);
            _CPU.PC++;
        };

        // A0
        Cpu.prototype.loadYRegCons = function () {
            _CPU.PC++;
            _CPU.XReg = parseInt(memory.readMem(_CPU.PC.toString()), 16);

            //_CPU.isExecuting = false;
            _CPU.PC++;
        };

        // AC
        Cpu.prototype.loadYRegMem = function () {
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.YReg = parseInt(memoryMngr.readMemory(loc.toString()), 16);
            _CPU.PC++;
        };

        // EA
        Cpu.prototype.noOperation = function () {
            return;
        };

        // 00
        Cpu.prototype.break = function () {
            //_CPU.PC++;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(end, 0));
        };

        // EC
        Cpu.prototype.compareToX = function () {
            _CPU.PC++;

            // Gets the address
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);

            // Gets the value in the specified address
            var value = parseInt(memoryMngr.readMem(loc));

            // Compares the content of the address with the
            if (value == _CPU.XReg.toString(16))
                _CPU.ZFlag = 1;
            else
                _CPU.ZFlag = 0;
            _CPU.PC++;
        };

        // D0
        Cpu.prototype.branchX = function () {
            if (_CPU.ZFlag == 0) {
                var byteValue = parseInt(memory.readMem(_CPU.PC + 1), 16);
                _CPU.PC += byteValue;

                if (_CPU.PC > _MemorySize) {
                    _CPU.PC = _CPU.PC - _MemorySize;
                }
            }
        };

        // EE
        Cpu.prototype.incByteVal = function () {
            //TODO
        };

        // FF
        Cpu.prototype.sysCall = function () {
            _StdOut.putText("Y register contains: " + _CPU.YReg);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
