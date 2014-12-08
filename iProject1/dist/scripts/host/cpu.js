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

        // Goes through this twice.
        Cpu.prototype.beginProcess = function (p) {
            _CPU.PC = p.getPC();
            _CPU.Acc = p.getAcc();
            _CPU.IR = p.getIR();
            _CPU.XReg = p.getXReg();
            _CPU.YReg = p.getYReg();
            _CPU.ZFlag = p.getZFlag();
            _CPU.isExecuting = true;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            // alert("PC: " + parseInt(_CPU.PC + process.getBase()));
            // Goes through all the opcodes.
            _CPU.runOpCode(memoryMngr.readMemory(_CPU.PC));

            // Updates the CPU block.
            _CPU.showCPU();

            // Updates the PCB.
            process.updatePCB();
            TSOS.Shell.updateRes();
        };

        // The CPU block
        Cpu.prototype.showCPU = function () {
            document.getElementById("PC").innerHTML = String(_CPU.PC + process.getProcessBase());
            document.getElementById("Acc").innerHTML = String(_CPU.Acc);
            document.getElementById("IR").innerHTML = String(_CPU.IR);
            document.getElementById("XReg").innerHTML = String(_CPU.XReg);
            document.getElementById("YReg").innerHTML = String(_CPU.YReg);
            document.getElementById("ZFlag").innerHTML = String(_CPU.ZFlag);
        };

        // Lists all the opcodes.
        Cpu.prototype.runOpCode = function (opcode) {
            opcode = opcode.toString().toUpperCase();

            //alert("opcode: " + opcode)
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
            } else {
                // Displays the bsod screen.
                _Console.ifError();
            }
        };

        // A9
        Cpu.prototype.loadAccConstant = function () {
            _CPU.IR = "A9";
            _CPU.PC++;
            _CPU.Acc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // AD
        Cpu.prototype.loadAccMem = function () {
            _CPU.IR = "AD";

            // Adding the two memory address together
            //            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1), 16);
            //            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2), 16);
            //            var temp = firstByte + secondByte;
            _CPU.PC++;
            var value = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.Acc = parseInt(memoryMngr.readMemory(value), 16);
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // 8D
        Cpu.prototype.storeAccMem = function () {
            //            _CPU.IR = "8D";
            //            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1));
            //            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2));
            //            var addr = parseInt(firstByte + secondByte);
            _CPU.PC++;

            var storage = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var acc = _CPU.Acc;
            memoryMngr.storeData(storage, acc.toString(16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // 6D
        Cpu.prototype.addWithCarry = function () {
            _CPU.IR = "6D";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var value = parseInt(memoryMngr.readMemory(loc), 16);

            var acc = parseInt(_CPU.Acc.toString());

            _CPU.Acc = value + acc;
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // A2
        Cpu.prototype.loadXRegCons = function () {
            _CPU.IR = "A2";
            _CPU.PC++;

            // alert("A2 CPU PC has: " + memoryMngr.readMemory(_CPU.PC));
            _CPU.XReg = parseInt(memoryMngr.readMemory(_CPU.PC).toString(), 16);

            // alert("XReg has" + _CPU.XReg);
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // AE
        Cpu.prototype.loadXMem = function () {
            _CPU.IR = "AE";
            _CPU.PC++;

            //            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1), 16);
            //            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2), 16);
            //            var addr = parseInt(firstByte + secondByte);
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.XReg = parseInt(memoryMngr.readMemory(loc), 16);
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // A0
        Cpu.prototype.loadYRegCons = function () {
            _CPU.IR = "A0";
            _CPU.PC++;

            //alert("A0 CPU PC has: " + memoryMngr.readMemory(_CPU.PC));
            _CPU.YReg = parseInt(memoryMngr.readMemory(_CPU.PC).toString(), 16);

            // alert("YReg has" + _CPU.YReg);
            _CPU.PC++;
            memoryMngr.updateMemory();
        };

        // AC
        Cpu.prototype.loadYRegMem = function () {
            _CPU.IR = "AC";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);

            //alert("AC loc: " + loc);
            //            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1), 16);
            //            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2), 16);
            //            var addr = parseInt(firstByte + secondByte);
            _CPU.YReg = parseInt(memoryMngr.readMemory(loc), 16);

            // alert("AC YReg has" + _CPU.YReg);
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // EA
        Cpu.prototype.noOperation = function () {
            _CPU.IR = "EA";
            return;
        };

        // 00
        Cpu.prototype.break = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(breakCall, 2));
        };

        // EC
        Cpu.prototype.compareToX = function () {
            _CPU.IR = "EC";
            _CPU.PC++;

            // Gets the address
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);

            // Gets the value in the specified address
            var value = parseInt(memoryMngr.readMemory(loc).toString(), 16);

            // alert("EC value: " + value);
            // Compares the content of the address with the X register.
            if (value == _CPU.XReg)
                _CPU.ZFlag = 1;
            else
                _CPU.ZFlag = 0;
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // D0
        Cpu.prototype.branchX = function () {
            _CPU.IR = "D0";

            //alert("D0 PC" +_CPU.PC + "ZFlag" + _CPU.ZFlag);
            if (_CPU.ZFlag == 0) {
                _CPU.PC++;
                var byteValue = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
                _CPU.PC += byteValue;

                // alert("PC: " + _CPU.PC);
                // alert("PC Before: "+parseInt(_CPU.PC+process.getBase())+", Limit: "+process.getLimit());
                if (_CPU.PC > 256) {
                    //alert(memory.getLimit());
                    _CPU.PC = _CPU.PC - (256);
                }

                //alert("PC After: "+parseInt(_CPU.PC+process.getBase()));
                //alert(_CPU.PC +2);
                _CPU.PC++;
                memoryMngr.updateMemory();
            } else {
                _CPU.PC += 2;
                memoryMngr.updateMemory();
            }
        };

        // EE
        Cpu.prototype.incByteVal = function () {
            _CPU.IR = "EE";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var value = parseInt(memoryMngr.readMemory(loc));
            value++;
            memoryMngr.storeData(loc, value.toString(16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        };

        // FF
        Cpu.prototype.sysCall = function () {
            _CPU.IR = "FF";
            this.PC++;
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(sysCall, -1));
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
