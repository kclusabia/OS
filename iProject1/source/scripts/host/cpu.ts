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

        // Goes through this twice.
        public beginProcess(p:TSOS.ProcessControlBlock):void {
            _CPU.PC = p.getPC();
            _CPU.Acc = p.getAcc();
            _CPU.IR = p.getIR();
            _CPU.XReg = p.getXReg();
            _CPU.YReg = p.getYReg();
            _CPU.ZFlag = p.getZFlag();
            _CPU.isExecuting = true;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

           // alert("PC: " + parseInt(_CPU.PC + process.getBase()));
            // Goes through all the opcodes.
            _CPU.runOpCode(memoryMngr.readMemory(_CPU.PC));

            // Updates the CPU block.
            _CPU.showCPU();

            // Updates the PCB.
            process.updatePCB();
            // Redraws the PCB.
            process.showPCB();

        }

        // The CPU block
        public showCPU() {
            document.getElementById("PC").innerHTML = String(_CPU.PC);
            document.getElementById("Acc").innerHTML = String(_CPU.Acc);
            document.getElementById("IR").innerHTML = String(_CPU.IR);
            document.getElementById("XReg").innerHTML = String(_CPU.XReg);
            document.getElementById("YReg").innerHTML = String(_CPU.YReg);
            document.getElementById("ZFlag").innerHTML = String(_CPU.ZFlag);
        }

        // Lists all the opcodes.
        public runOpCode(opcode) {
            opcode = opcode.toString().toUpperCase();
            
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
            else {
                //_StdOut.putText("The input contained an invalid op code");
               // alert("opcode: " + opcode + "PC: " + _CPU.PC);
                _KernelInterruptQueue.enqueue(new Interrupt(invalidOpCode, 3));
               // _Console.advanceLine();
                //return;
            }
        }

        // A9
        public loadAccConstant() {
            _CPU.IR = "A9";
            _CPU.PC++;
            _CPU.Acc = memoryMngr.readMemory(_CPU.PC);
            _CPU.PC++;
            memoryMngr.updateMemory();
        }

        // AD
        public loadAccMem() {
            _CPU.IR = "AD";
            // Adding the two memory address together
//            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1), 16);
//            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2), 16);
//            var temp = firstByte + secondByte;
            _CPU.PC++;
            var value = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.Acc = parseInt(memoryMngr.readMemory(value));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // 8D
        public storeAccMem() {
            _CPU.IR = "8D";
            // Getting the address to store the accumulator.
//            var firstByte = parseInt(memoryMngr.readMemory(_CPU.PC+1));
//            var secondByte = parseInt(memoryMngr.readMemory(_CPU.PC+2));
//            var temp = firstByte + secondByte;
            _CPU.PC++;

            var storage = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var acc = _CPU.Acc;
            memoryMngr.storeData(storage, acc.toString(16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // 6D
        public addWithCarry() {
            _CPU.IR = "6D";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC.toString()), 16);
            var value = parseInt(memoryMngr.readMemory(loc), 16);

            // Changed to string to change its base to hex.
            var acc = parseInt(_CPU.Acc.toString());

            _CPU.Acc = value + acc;
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // A2
        public loadXRegCons() {
            _CPU.IR = "A2";
            _CPU.PC++;
            _CPU.XReg = parseInt(memoryMngr.readMemory(_CPU.PC, 16));
            _CPU.PC++;
            memoryMngr.updateMemory();
        }

        // AE
        public loadXMem() {
            _CPU.IR = "AE";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.XReg = parseInt(memoryMngr.readMemory(loc, 16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // A0
        public loadYRegCons() {
            _CPU.IR = "A0";
            _CPU.PC++;
            _CPU.YReg = parseInt(memoryMngr.readMemory(_CPU.PC).toString(), 16);
            _CPU.PC++;
            memoryMngr.updateMemory();
        }

        // AC
        public loadYRegMem() {
            _CPU.IR = "AC";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            _CPU.YReg = parseInt(memoryMngr.readMemory(loc, 16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // EA
        public noOperation() {
            _CPU.IR = "EA";
            return;
        }

        // 00
        public break() {
            _KernelInterruptQueue.enqueue(new Interrupt(breakCall, 2));
        }

        // EC
        public compareToX() {
            _CPU.IR = "EC";
            _CPU.PC++;
            // Gets the address
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            // Gets the value in the specified address
            var value = parseInt(memoryMngr.readMemory(loc));
            // Compares the content of the address with the X register.
            if(value == _CPU.XReg.toString(10))
                _CPU.ZFlag = 1;
            else
                _CPU.ZFlag = 0;
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // D0
        public branchX() {
            _CPU.IR = "D0";
            if(_CPU.ZFlag == 0) {
                _CPU.PC++;
                alert("PC before Byte: " + _CPU.PC);
                var byteValue:number = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
                _CPU.PC += byteValue;
                alert("PC" + _CPU.PC);
                alert("PC Before: "+parseInt(_CPU.PC+process.getBase())+", Limit: "+process.getLimit());
                if(_CPU.PC > 256) {
                    //alert(memory.getLimit());
                    _CPU.PC = _CPU.PC - (256);
                }
                alert("PC After: "+parseInt(_CPU.PC+process.getBase()));
                //alert(_CPU.PC +2);
                _CPU.PC++;
              memoryMngr.updateMemory();
                }
            else {
                _CPU.PC += 2;
                memoryMngr.updateMemory();
            }
        }

        // EE
        public incByteVal() {
            _CPU.IR = "EE";
            _CPU.PC++;
            var loc = parseInt(memoryMngr.readMemory(_CPU.PC), 16);
            var value = parseInt(memoryMngr.readMemory(loc));
            value++;
            memoryMngr.storeData(loc, value.toString(16));
            _CPU.PC += 2;
            memoryMngr.updateMemory();
        }

        // FF
        public sysCall() {
            _CPU.IR = "FF";
            this.PC++;
            _KernelInterruptQueue.enqueue(new Interrupt(sysCall, -1));
        }
    }
}
