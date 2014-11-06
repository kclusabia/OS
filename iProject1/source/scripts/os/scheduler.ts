/**
 * Created by kara2 on 11/5/14.
 */
module TSOS {
    export class Scheduler {
        public schedulerType = "";
        public schedulers:string[] = ("RoundRobin", "FCFS" , "NonPreemptive");

        constructor() {
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
                return readyQueue.dequeue();
            }
        }

        public getNewProcess() {
            if(!readyQueue.isEmpty()) {
                process = readyQueue.dequeue();
                process.setState(0);            // sets the state to new
                _CPU.beginProcess(process);
                Shell.updateRes();
            }
            else if(readyQueue.isEmpty() && process.getState() == "terminated") {
                this.init();
                return;
            }
        }

        public contextSwitch() {
            if(readyQueue.isEmpty() && process.getState() == "terminated") {
                _CPU.init();
                return;
            }
            else {
                this.doSwitcheroo();            // puts the current process at the end of ready queue and is waiting.
            }

            var process = readyQueue.dequeue();
            process.setState(1);            // set state to running.
            _CPU.beginProcess(process);
            Shell.updateRes();
        }

        public doSwitcheroo() {
            process.setPC(_CPU.PC);
            process.setAcc(_CPU.Acc);
            process.setIR(_CPU.IR);
            process.setXReg(_CPU.XReg);
            process.setYReg(_CPU.YReg);
            process.setZFlag(_CPU.ZFlag);
            readyQueue.enqueue(process);
            process.setState(2);
            process.showPCB();
            _CPU.showCPU();
            return;
        }




    }
}



