/**
* Created by kara2 on 11/5/14.
*/
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler() {
            this.schedulerType = "";
            this.schedulers = ["RoundRobin", "FCFS", "NonPreemptive"];
            // this.schedulerType = schedulers[0];
        }
        Scheduler.prototype.init = function () {
            clockCycle = 0;
            _CPU.showCPU();
            process.showPCB();
        };

        Scheduler.prototype.getScheduler = function (index) {
            this.schedulerType = this.schedulers[index];
        };

        //        //start new process
        //        public startProcess() {
        //            if(readyQueue.getSize() > 0) {
        //                process = readyQueue.dequeue();
        //            }
        //        }
        Scheduler.prototype.startProcess = function () {
            alert("top");
            if (!readyQueue.isEmpty()) {
                alert("In startProcess");
                process = readyQueue.dequeue();
                process.setState(0); // sets the state to new
                _CPU.beginProcess(process);
                TSOS.Shell.updateRes();
            } else if (readyQueue.isEmpty() && process.getState() == "terminated") {
                this.init();
                return;
            }
        };

        Scheduler.prototype.contextSwitch = function () {
            this.init();
            if (readyQueue.isEmpty() && process.getState() == "terminated") {
                _CPU.init();
                return;
            }

            //  else {
            this.doSwitcheroo(); // puts the current process at the end of ready queue and is waiting.

            //    }
            process = readyQueue.dequeue();
            _Kernel.krnTrace("Context switched. Processing PID: " + process.getPID());
            process.setState(1); // set state to running.
            _CPU.beginProcess(process);
            TSOS.Shell.updateRes();
        };

        Scheduler.prototype.doSwitcheroo = function () {
            // need this info for the next process to know.
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
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
