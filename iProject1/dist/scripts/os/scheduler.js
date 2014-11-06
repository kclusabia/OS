/**
* Created by kara2 on 11/5/14.
*/
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler() {
            this.schedulerType = "";
            this.schedulers = ("RoundRobin", "FCFS", "NonPreemptive");
        }
        Scheduler.prototype.init = function () {
            clockCycle = 0;
            _CPU.showCPU();
            process.showPCB();
        };

        Scheduler.prototype.getScheduler = function (index) {
            this.schedulerType = this.schedulers[index];
        };

        //start new process
        Scheduler.prototype.startProcess = function () {
            if (readyQueue.getSize() > 0) {
                return readyQueue.dequeue();
            }
        };

        Scheduler.prototype.getNewProcess = function () {
            if (!readyQueue.isEmpty()) {
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
            if (readyQueue.isEmpty() && process.getState() == "terminated") {
                _CPU.init();
                return;
            } else {
                this.doSwitcheroo(); // puts the current process at the end of ready queue and is waiting.
            }

            var process = readyQueue.dequeue();
            process.setState(1); // set state to running.
            _CPU.beginProcess(process);
            TSOS.Shell.updateRes();
        };

        Scheduler.prototype.doSwitcheroo = function () {
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
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
