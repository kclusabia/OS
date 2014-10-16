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

            // Goes through all the opcodes.
            _CPU.runOpCode(memory.readMem(_CPU.PC));

            // Updates the CPU block.
            _CPU.showCPU();

            // Redraws the PCB.
            pcb.showPCB();

            // Updates the PCB.
            pcb.updatePCB();
        }

        // The CPU block
        public showCPU() {
            document.getElementById("PC").innerHTML = String(this.PC);
            document.getElementById("Acc").innerHTML = this.Acc.toString();
            document.getElementById("IR").innerHTML = String(this.IR);
            document.getElementById("XReg").innerHTML = String(this.XReg);
            document.getElementById("YReg").innerHTML = String(this.YReg);
            document.getElementById("ZFlag").innerHTML = String(this.ZFlag);
        }

        // Lists all the opcodes.
        public runOpCode(opcode) {
            opcode = opcode.toString().toUpperCase();
            this.IR = opcode;
            
            if(opcode == "A9") {
                this.loadAccConstant();
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

        // A9
        public loadAccConstant() {
            this.PC++;
            _CPU.Acc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);   //a9 11 gives 17(dec)
           // _CPU.isExecuting = false;
            _CPU.PC++;
            memoryMngr.updateMemory();
        }

        // AD
        public loadAccMem() {
            _CPU.PC++;
            // Getting the address as hex.
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.Acc = parseInt(memoryMngr.readMemory(loc));
            _CPU.PC++;
            memoryMngr.updateMemory();
        }

        // 8D
        public storeAccMem() {
            _CPU.PC++;
            // Storage is now read as a hex
            var storage = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            memoryMngr.storeData(storage,parseInt((_CPU.Acc), 16));
            _CPU.PC++;
            memoryMngr.updateMemory();

        }

        // 6D
        public addWithCarry() {
            this.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var value = parseInt(memoryMngr.readMemory(loc));
            // Changed to string to change its base to hex.
            var acc = parseInt(this.Acc.toString(), 16);
            _CPU.Acc = value + acc;
            _CPU.PC++;
        }

        // A2
        public loadXRegCons() {
            _CPU.PC++;
            _CPU.XReg = parseInt(memory.readMem(_CPU.PC.toString()), 16);
            //_CPU.isExecuting = false;
            _CPU.PC++;
        }

        // AE
        public loadXMem() {
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.XReg = parseInt(memoryMngr.readMemory(loc.toString()), 16);
            _CPU.PC++;
        }

        // A0
        public loadYRegCons() {
            _CPU.PC++;
            _CPU.XReg = parseInt(memory.readMem(_CPU.PC.toString()), 16);
            //_CPU.isExecuting = false;
            _CPU.PC++;
        }

        // AC
        public loadYRegMem() {
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.YReg = parseInt(memoryMngr.readMemory(loc.toString()), 16);
            _CPU.PC++;
        }

        // EA
        public noOperation() {
            return;
        }

        // 00
        public break() {
            //_CPU.PC++;
            _KernelInterruptQueue.enqueue(new Interrupt(end, 0));
        }

        // EC
        public compareToX() {
            _CPU.PC++;
            // Gets the address
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            // Gets the value in the specified address
            var value = parseInt(memoryMngr.readMem(loc));
            // Compares the content of the address with the X register.
            if(value == _CPU.XReg.toString(16))
                _CPU.ZFlag = 1;
            else
                _CPU.ZFlag = 0;
            _CPU.PC++;
        }

        // D0
        public branchX() {
            if(_CPU.ZFlag == 0) {
                var byteValue = parseInt(memory.readMem(_CPU.PC+1), 16);
                _CPU.PC += byteValue;

                if(_CPU.PC > _MemorySize) {
                    _CPU.PC = _CPU.PC - _MemorySize;
                }
            }
        }

        // EE
        public incByteVal() {
            //TODO
        }

        // FF
        public sysCall() {
            _StdOut.putText("Y register contains: " + _CPU.YReg);
        }
    }
}
