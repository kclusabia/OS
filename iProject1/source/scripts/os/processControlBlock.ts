/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {

        public static pid = -1;
        public pc = 0;
        public state = "";
        public base:number = 0;
        public limit = "";
        public acc = 0;
        public IR = "";
        public xReg = 0;
        public yReg = 0;
        public zFlag = 0;
        public size = 255;
        public states:string[] = new Array("new", "running", "waiting", "ready", "terminated");

        constructor() {
         }

        // Creating a PCB block.
        public newPCB(base:number, limit:string, state:number):void {
            this.base = base;                                   //this.base = (limit.toString(16).toUpperCase()) + 1
            this.limit = limit.toString(16).toUpperCase();      // this.limit = this.base + this.size;
            this.state = this.states[state];
            this.incrementPID();
            this.showPCB();
        }

        // Displays the PCB block on the screen.
        public showPCB() {
            document.getElementById("PID").innerHTML = this.getPID();
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("State").innerHTML = this.state;
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
//            ProcessControlBlock.pid = pcb.getPID();//
            pcb.pc = _CPU.PC;
            pcb.acc = _CPU.Acc;
            pcb.IR = _CPU.IR;
            pcb.xReg = _CPU.XReg;
            pcb.yReg = _CPU.YReg;
            pcb.zFlag = _CPU.ZFlag;
        }

        // Increments the PID.
        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        // Gets the current PID.
        public getPID():number{
            return ProcessControlBlock.pid;
        }

        public setState(index:number):void {
            this.state = this.states[index];
        }

        public getState():string {
            return this.state;
        }

        public getBase():number {
            return this.base;
        }

        public getLimit():number {
            return this.limit;
        }

//        public incrementSegment():void {
//            ProcessControlBlock.segment++;
//        }
    }
}