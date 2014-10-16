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

        // Creating a PCB block.
        public newPCB(base:number, limit:string):void {
            this.base = base;
            this.limit = limit.toString(16).toUpperCase();
            this.incrementPID();
        }

        // Displays the PCB block on the screen.
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

        // Updates the PCB block.
        public updatePCB() {
            ProcessControlBlock.pc = _CPU.PC;
            //ProcessControlBlock.pid = ProcessControlBlock.getPID();
            this.acc = _CPU.Acc;
            this.IR = _CPU.IR;
            this.xReg = _CPU.XReg;
            this.yReg = _CPU.YReg;
            this.zFlag = _CPU.ZFlag;
        }

        // Increments the PID.
        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        // Gets the current PID.
        public getPID():number{
            return ProcessControlBlock.pid;
        }
    }
}