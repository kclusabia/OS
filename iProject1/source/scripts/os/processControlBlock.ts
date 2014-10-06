/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {
        constructor() {
    }

        public newPCB(pid, status, initMem, finalMem) {
            this.pid = pid;
            this.status = status;
            this.initMem = initMem;
            this.finalMem = finalMem;
        }
    }
}