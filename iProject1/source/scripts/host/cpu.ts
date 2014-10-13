///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public IR: string = "",
                    public XReg: number = 0,
                    public YReg: number = 0,
                    public ZFlag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.IR = "";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            _CPU.runOpCode(mm.readMemory(_CPU.PC));
            _CPU.showCPU();
            pcb.showPCB();
           //pcb.updatePCB();
        }

        public showCPU() {
            document.getElementById("PC").innerHTML = String(this.PC);
            document.getElementById("Acc").innerHTML = this.Acc.toString();
            document.getElementById("IR").innerHTML = String(this.IR);
            document.getElementById("XReg").innerHTML = String(this.XReg);
            document.getElementById("YReg").innerHTML = String(this.YReg);
            document.getElementById("ZFlag").innerHTML = String(this.ZFlag);
        }

        public runOpCode(opcode) {
            opcode = opcode.toString().toUpperCase();
            this.IR = opcode;
            
            if(opcode == "A9") {
                _CPU.loadAccConstant();
            }
            else if(opcode == "AD") {
                this.loadAccMem();
            }
            else if(opcode == "8D") {
                this.storeAccMem();
            }
            else if(opcode == "6D") {
                this.addWithCarry();
            }
            else if(opcode == "A2") {
                this.loadXRegCons();
            }
            else if(opcode == "AE") {
                this.loadXMem();
            }
            else if(opcode == "A0") {
                this.loadYRegCons();
            }
            else if(opcode == "AC") {
                this.loadYRegMem();
            }
            else if(opcode == "EA") {
                this.noOperation();
            }
            else if(opcode == "00") {
                this.break();
            }
            else if(opcode == "EC") {
                this.compareToX();
            }
            else if(opcode == "D0") {
                this.branchX();
            }
            else if(opcode == "EE") {
                this.incByteVal();
            }
            else if(opcode == "FF") {
                this.sysCall();
            }
        }

        public loadAccConstant() {
            _CPU.PC++;
            _CPU.Acc = memory.readMem(_CPU.PC);
            //_CPU.isExecuting = false;
            _CPU.PC++;
        }

        public loadAccMem() {
            _CPU.PC++;

            var loc = parseInt(memory.readMem(_CPU.PC), 16);
            _CPU.Acc = parseInt(memory.readMem(loc), 10);
            _CPU.PC++;
        }

        public storeAccMem() {
            _CPU.PC++;
            var loc = parseInt(memory.readMem(_CPU.PC), 16);
            memory.storeData(loc,parseInt((_CPU.Acc), 16));
            _CPU.PC++;

        }

        public addWithCarry() {
            //TODO
        }

        public loadXRegCons() {
            _CPU.PC++;
            _CPU.XReg = parseInt(memory.readMem(_CPU.PC), 10);
            _CPU.PC++;
        }

        public loadXMem() {
            //TODO
        }

        public loadYRegCons() {
            //TODO
        }

        public loadYRegMem() {
            //TODO
        }

        public noOperation() {
            //TODO
        }

        public break() {
            _CPU.PC++;
        }

        public compareToX() {
            //TODO
        }

        public branchX() {
            //TODO
        }

        public incByteVal() {
            //TODO
        }

        public sysCall() {
            //TODO
        }
    }
}
