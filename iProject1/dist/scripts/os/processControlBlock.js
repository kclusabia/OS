/* ------------
The Process Control Block for
various processes.
------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
        }
        ProcessControlBlock.prototype.newPCB = function (pid, base, limit) {
            this.pid = pid;
            this.base = base;
            this.limit = limit;

            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zReg = 0;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
