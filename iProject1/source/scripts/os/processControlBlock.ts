/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {

        public static pid = -1;
        public static pc = 0;
        public base:number = 0;
        public limit = "";
        public acc = 0;
        public xReg = 0;
        public yReg = 0;
        public zReg = 0;

        constructor() {
         }

        public newPCB(base:number, limit:string):void {
            this.base = base;
            this.limit = limit;
            this.incrementPID();
        }

        public showPCB() {
            document.getElementById("PID").innerHTML = this.pid;
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("Acc1").innerHTML = this.acc;
            document.getElementById("Base").innerHTML = this.base;
            document.getElementById("Limit").innerHTML = this.limit;
            document.getElementById("XReg1").innerHTML = this.xReg;
            document.getElementById("YReg1").innerHTML = this.yReg;
            document.getElementById("ZReg1").innerHTML = this.zReg;
        }

        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        public getPID() :number{
            return ProcessControlBlock.pid;
        }
    }
}