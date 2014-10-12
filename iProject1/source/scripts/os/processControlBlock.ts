/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {
        constructor() {
    }

        public newPCB(pid, base, limit) {
            this.pid = pid;
            this.base = base;
            this.limit = limit;

            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zReg = 0;
        }
    }
}