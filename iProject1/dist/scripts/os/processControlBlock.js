/* ------------
The Process Control Block for
various processes.
------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
            this.base = 0;
            this.limit = "";
            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zReg = 0;
        }
        ProcessControlBlock.prototype.newPCB = function (base, limit) {
            this.base = base;
            this.limit = limit;
            this.incrementPID();
        };

        ProcessControlBlock.prototype.showPCB = function () {
            document.getElementById("PID").innerHTML = this.pid;
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("Acc1").innerHTML = this.acc;
            document.getElementById("Base").innerHTML = this.base;
            document.getElementById("Limit").innerHTML = this.limit;
            document.getElementById("XReg1").innerHTML = this.xReg;
            document.getElementById("YReg1").innerHTML = this.yReg;
            document.getElementById("ZReg1").innerHTML = this.zReg;
        };

        ProcessControlBlock.prototype.incrementPID = function () {
            ProcessControlBlock.pid++;
        };

        ProcessControlBlock.prototype.getPID = function () {
            return ProcessControlBlock.pid;
        };
        ProcessControlBlock.pid = -1;
        ProcessControlBlock.pc = 0;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
