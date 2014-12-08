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
        public location:string;
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
        }

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

        public incrementPID():void {
            ProcessControlBlock.pid++;
        }

        public getPID():number{
            return this.pid1;
        }

        public setState(index:number):void {
            this.state = this.states[index];
        }

        public getLocation(){
            return this.location;
        }

        public setLocation(location) {
            this.location = location;
        }

        public getState():string {
            return this.state;
        }

        public getProcessBase():number {
            return this.base;
        }

        public getProcessLimit():number {
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

        public setProcessBase(base) {
            this.base = base;
        }

        public setProcessLimit(limit) {
            this.limit = limit;
        }
    }
}