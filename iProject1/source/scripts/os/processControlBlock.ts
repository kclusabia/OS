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
        public IR = "";
        public xReg = 0;
        public yReg = 0;
        public zFlag = 0;

        constructor() {
         }

        public newPCB(base:number, limit:string):void {
            this.base = base;
            this.limit = limit.toString(16).toUpperCase();
            this.incrementPID();
        }

        public showPCB() {
            document.getElementById("PID").innerHTML = this.getPID();
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("Acc1").innerHTML = this.acc;
            document.getElementById("IR1").innerHTML = this.IR;
            document.getElementById("Base").innerHTML = this.base;
            document.getElementById("Limit").innerHTML = this.limit;
            document.getElementById("XReg1").innerHTML = this.xReg;
            document.getElementById("YReg1").innerHTML = this.yReg;
            document.getElementById("ZFlag1").innerHTML = this.zFlag;
        }

        public updatePCB() {
            this.pc = _CPU.PC;
            this.acc = _CPU.Acc;
            this.IR = _CPU.IR;
            this.xReg = _CPU.XReg;
            this.yReg = _CPU.YReg;
            this.zFlag = _CPU.ZFlag;
        }

        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        public getPID():number{
            return ProcessControlBlock.pid;
        }
    }
}