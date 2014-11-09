/* ------------
The Process Control Block for

various processes.
 ------------ */
module TSOS {
    export class ProcessControlBlock {

        public static pid = -1;
        public pid1 = ProcessControlBlock.pid;
        public pc = 0;
        public state = "";
        public base:number = 0;
        public limit:number = 0;
        public acc = 0;
        public IR = "";
        public xReg = 0;
        public yReg = 0;
        public zFlag = 0;
        public states:string[] = new Array("new", "running", "waiting", "ready", "terminated");

        constructor() {
         }

        // Creating a PCB block.
        public newPCB(base:number, limit:number, state:number):void {
            this.incrementPID();
            this.pid1 = ProcessControlBlock.pid;
            this.pc = 0;
            this.base = base;                                   //this.base = (limit.toString(16).toUpperCase()) + 1
            this.limit = limit;     // this.limit = this.base + this.size;
            this.state = this.states[state];
            //this.showResident();
        }

        // Displays the ready the queue.
        public showPCB() {
            document.getElementById("PID").innerHTML = this.getPID();
            document.getElementById("PC1").innerHTML = this.pc;
            document.getElementById("State").innerHTML = this.state;
            document.getElementById("Acc1").innerHTML = this.acc;
            document.getElementById("IR1").innerHTML = this.IR;
            document.getElementById("Base").innerHTML = this.base;
            document.getElementById("Limit").innerHTML = parseInt(this.limit,16);
            document.getElementById("XReg1").innerHTML = this.xReg;
            document.getElementById("YReg1").innerHTML = this.yReg;
            document.getElementById("ZFlag1").innerHTML = this.zFlag;
        }

//        public showResident() {
//            document.getElementById("PIDR").innerHTML = this.getPID();
//            document.getElementById("StateR").innerHTML = this.state;
//            document.getElementById("BaseR").innerHTML = this.base;
//            document.getElementById("LimitR").innerHTML = this.limit;
//        }

        // Updates the PCB block.
        public updatePCB() {
//            ProcessControlBlock.pid = pcb.getPID();//
            process.pc = _CPU.PC;
            process.acc = _CPU.Acc;
            process.IR = _CPU.IR;
            process.xReg = _CPU.XReg;
            process.yReg = _CPU.YReg;
            process.zFlag = _CPU.ZFlag;
        }

        // Increments the PID.
        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        // Gets the current PID.
        public getPID():number{
            return this.pid1;
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

        public getPC() {
            return this.pc;
        }

        public setPC(pc:number) {
            this.pc = pc;
        }

        public getAcc() {
            return this.acc;
        }

        public setAcc(Acc) {
            this.acc = Acc;
        }

        public getIR() {
            return this.IR;
        }

        public setIR(ir) {
            this.IR = ir;
        }

        public getXReg() {
            return this.xReg;
        }

        public setXReg(xreg) {
            this.xReg = xreg;
        }

        public getYReg() {
            return this.yReg;
        }

        public setYReg(yreg) {
            this.yReg = yreg;
        }

        public getZFlag() {
            return this.zFlag;
        }

        public setZFlag(zflag) {
            this.zFlag = zflag;
        }


    }
}