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
            process.showPCB();
        }

        public getScheduler(index:number) {
            this.schedulerType = this.schedulers[index];
        }


        public startProcess() {
            if(readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();
                process.setState(1);            // sets the state to running
                _CPU.beginProcess(process);
                _Kernel.krnTrace("Processing PID " + process.getPID());
                Shell.updateRes();
            }
            else if(readyQueue.isEmpty() && (process.getState() != "terminated")) {
               this.init();
                alert("breakCall startProcess");
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

        public doSwitcheroo() {
            // need this info for the next process to know.
            process.setPC(_CPU.PC);
            process.setAcc(_CPU.Acc);
            process.setIR(_CPU.IR);
            process.setXReg(_CPU.XReg);
            process.setYReg(_CPU.YReg);
            process.setZFlag(_CPU.ZFlag);
            process.setState(2);
            readyQueue.enqueue(process);
           // process.showPCB();
            _CPU.showCPU();
        }

    }
}



