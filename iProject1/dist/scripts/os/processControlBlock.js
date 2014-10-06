/* ------------
The Process Control Block for
various processes.
------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock() {
        }
        ProcessControlBlock.prototype.newPCB = function (pid, status, initMem, finalMem) {
            this.pid = pid;
            this.status = status;
            this.initMem = initMem;
            this.finalMem = finalMem;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
