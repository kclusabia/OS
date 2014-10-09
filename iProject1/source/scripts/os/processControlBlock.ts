/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {
        constructor() {
    }

        public newPCB(pid, status, pc, initMem, finalMem) {
            this.pid = pid;
            this.status = status;
            this.pc = pc;
            this.initMem = initMem;
            this.finalMem = finalMem;

            this.acc = 0;
            this.xReg = 0;
            this.yReg = 0;
            this.zReg = 0;
        }
    }
}