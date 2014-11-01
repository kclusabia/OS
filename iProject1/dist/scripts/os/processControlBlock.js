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
            this.limit = "";
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
            this.base = base; //this.base = (limit.toString(16).toUpperCase()) + 1
            this.limit = limit.toString(16).toUpperCase(); // this.limit = this.base + this.size;
            this.state = this.states[state];
            this.showPCB();
        };

        // Displays the PCB block on the screen.
        ProcessControlBlock.prototype.showPCB = function () {
            document.getElementById("PID").innerHTML = this.getPID();
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("State").innerHTML = this.state;
            document.getElementById("Acc1").innerHTML = this.acc;
            document.getElementById("IR1").innerHTML = this.IR;
            document.getElementById("Base").innerHTML = this.base;
            document.getElementById("Limit").innerHTML = this.limit;
            document.getElementById("XReg1").innerHTML = this.xReg;
            document.getElementById("YReg1").innerHTML = this.yReg;
            document.getElementById("ZFlag1").innerHTML = this.zFlag;
        };

        // Updates the PCB block.
        ProcessControlBlock.prototype.updatePCB = function () {
            //            ProcessControlBlock.pid = pcb.getPID();//
            pcb.pc = _CPU.PC;
            pcb.acc = _CPU.Acc;
            pcb.IR = _CPU.IR;
            pcb.xReg = _CPU.XReg;
            pcb.yReg = _CPU.YReg;
            pcb.zFlag = _CPU.ZFlag;
        };

        // Increments the PID.
        ProcessControlBlock.prototype.incrementPID = function () {
            ProcessControlBlock.pid++;
        };

        // Gets the current PID.
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
        ProcessControlBlock.pid = -1;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
