/* ------------
The Process Control Block for
various processes.
------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
            this.pid1 = ProcessControlBlock.pid;
            this.pc = 0;
            this.state = "";
            this.base = 0;
            this.limit = 0;
            this.acc = 0;
            this.IR = "";
            this.xReg = 0;
            this.yReg = 0;
            this.zFlag = 0;
            this.states = new Array("new", "running", "waiting", "ready", "terminated");
        }
        // Creating a PCB block.
        ProcessControlBlock.prototype.newPCB = function (base, limit, state) {
            this.incrementPID();
            this.pid1 = ProcessControlBlock.pid;
            this.pc = 0;
            this.base = base; //this.base = (limit.toString(16).toUpperCase()) + 1
            this.limit = limit; // this.limit = this.base + this.size;
            this.state = this.states[state];
        };

        // Updates the PCB block.
        ProcessControlBlock.prototype.updatePCB = function () {
            //            ProcessControlBlock.pid = pcb.getPID();//
            process.pc = _CPU.PC;
            process.acc = _CPU.Acc;
            process.IR = _CPU.IR;
            process.xReg = _CPU.XReg;
            process.yReg = _CPU.YReg;
            process.zFlag = _CPU.ZFlag;
        };

        ProcessControlBlock.prototype.incrementPID = function () {
            ProcessControlBlock.pid++;
        };

        ProcessControlBlock.prototype.getPID = function () {
            return this.pid1;
        };

        ProcessControlBlock.prototype.setState = function (index) {
            this.state = this.states[index];
        };

        ProcessControlBlock.prototype.getState = function () {
            return this.state;
        };

        ProcessControlBlock.prototype.getBase = function () {
            return this.base;
        };

        ProcessControlBlock.prototype.getLimit = function () {
            return this.limit;
        };

        ProcessControlBlock.prototype.getPC = function () {
            return this.pc;
        };

        ProcessControlBlock.prototype.setPC = function (pc) {
            this.pc = pc;
        };

        ProcessControlBlock.prototype.getAcc = function () {
            return this.acc;
        };

        ProcessControlBlock.prototype.setAcc = function (Acc) {
            this.acc = Acc;
        };

        ProcessControlBlock.prototype.getIR = function () {
            return this.IR;
        };

        ProcessControlBlock.prototype.setIR = function (ir) {
            this.IR = ir;
        };

        ProcessControlBlock.prototype.getXReg = function () {
            return this.xReg;
        };

        ProcessControlBlock.prototype.setXReg = function (xreg) {
            this.xReg = xreg;
        };

        ProcessControlBlock.prototype.getYReg = function () {
            return this.yReg;
        };

        ProcessControlBlock.prototype.setYReg = function (yreg) {
            this.yReg = yreg;
        };

        ProcessControlBlock.prototype.getZFlag = function () {
            return this.zFlag;
        };

        ProcessControlBlock.prototype.setZFlag = function (zflag) {
            this.zFlag = zflag;
        };
        ProcessControlBlock.pid = -1;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
