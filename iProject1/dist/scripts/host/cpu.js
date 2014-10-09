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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.runOpCode = function (opcode) {
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

        Cpu.prototype.loadAccConstant = function () {
            //TODO
        };

        Cpu.prototype.loadAccMem = function () {
            //TODO
        };

        Cpu.prototype.storeAccMem = function () {
            //TODO
        };

        Cpu.prototype.addWithCarry = function () {
            //TODO
        };

        Cpu.prototype.loadXRegCons = function () {
            //TODO
        };

        Cpu.prototype.loadXMem = function () {
            //TODO
        };

        Cpu.prototype.loadYRegCons = function () {
            //TODO
        };

        Cpu.prototype.loadYRegMem = function () {
            //TODO
        };

        Cpu.prototype.noOperation = function () {
            //TODO
        };

        Cpu.prototype.break = function () {
            //TODO
        };

        Cpu.prototype.compareToX = function () {
            //TODO
        };

        Cpu.prototype.branchX = function () {
            //TODO
        };

        Cpu.prototype.incByteVal = function () {
            //TODO
        };

        Cpu.prototype.sysCall = function () {
            //TODO
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
