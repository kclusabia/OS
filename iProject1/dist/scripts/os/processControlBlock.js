/* ------------
The Process Control Block for
various processes.
------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
            this.pc = 0;
            this.base = 0;
            this.limit = "";
            this.acc = 0;
            this.IR = "";
            this.xReg = 0;
            this.yReg = 0;
            this.zFlag = 0;
        }
        // Creating a PCB block.
        ProcessControlBlock.prototype.newPCB = function (base, limit) {
            this.base = base;
            this.limit = limit.toString(16).toUpperCase();
            this.incrementPID();
        };

        // Displays the PCB block on the screen.
        ProcessControlBlock.prototype.showPCB = function () {
            document.getElementById("PID").innerHTML = this.getPID();
            document.getElementById("PC1").innerHTML = this.pc;
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

            //ProcessControlBlock.pid = ProcessControlBlock.getPID();
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
            return ProcessControlBlock.pid;
        };
        ProcessControlBlock.pid = -1;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
