/**
 * Created by kara2 on 11/5/14.
 */
module TSOS {
    export class Scheduler {
        public schedulerType:string = "";
        public schedulers:string[] = ["RoundRobin", "FCFS", "NonPreemptive"];

        constructor() {
           // this.schedulerType = schedulers[0];
        }

        public init() {
            clockCycle = 0;
            _CPU.showCPU();
        }

        public getScheduler(index:number) {
            this.schedulerType = this.schedulers[index];
        }

        // Gets the next process and executes it.
        public startProcess() {
            if(readyQueue.isEmpty() && process.getState() == "terminated") {
                _CPU.init();
                Shell.updateRes();
               // memoryMngr.updateMemory();
            }
            if(readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();
                if(process.getState() == "terminated") {
                    this.init();
                    this.startProcess();
                    Shell.updateRes();
                   // memoryMngr.updateMemory();
                }
                else {
                    process.setState(1);            // sets the state to running
                    _CPU.beginProcess(process);
                    _Kernel.krnTrace("Processing PID " + process.getPID());
                    Shell.updateRes();
                    //memoryMngr.updateMemory();
                }
            }
            // Resets the clock cycle.
            else if(readyQueue.isEmpty() && (process.getState() != "terminated")) {
               this.init();
                return;
            }
        }

//        public contextSwitch() {
//            this.init();
//            if(readyQueue.isEmpty() && process.getState() == "terminated") {
//                _CPU.init();
//                return;
//            }
//                this.doSwitcheroo();            // puts the current process at the end of ready queue and is waiting.
//
//            process = readyQueue.dequeue();
//            _Kernel.krnTrace("Context switched. Processing PID: " + process.getPID());
//            process.setState(1);            // set state to running.
//            _CPU.beginProcess(process);
//            Shell.updateRes();
//        }

        // Storing the information from the previous process, so the next process knows where the previous process left off.
        public doSwitcheroo() {
            process.setPC(_CPU.PC);
            process.setAcc(_CPU.Acc);
            process.setIR(_CPU.IR);
            process.setXReg(_CPU.XReg);
            process.setYReg(_CPU.YReg);
            process.setZFlag(_CPU.ZFlag);
            process.setState(2);            // waiting state
            readyQueue.enqueue(process);
            _CPU.showCPU();
        }

    }
}



