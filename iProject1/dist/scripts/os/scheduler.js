/**
* Created by kara2 on 11/5/14.
*/
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler(newScheduler) {
            schedulerType = newScheduler;
        }
        Scheduler.prototype.init = function () {
            clockCycle = 0;
            _CPU.showCPU();
        };

        // Gets the next process and executes it.
        Scheduler.prototype.startProcess = function () {
            if (readyQueue.isEmpty() && process.getState() == "terminated") {
                _CPU.init();
                TSOS.Shell.updateRes();
            }
            if (readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();
                if (process.getState() == "terminated") {
                    this.init();
                    this.startProcess();
                    TSOS.Shell.updateRes();
                } else {
                    process.setState(1); // sets the state to running
                    _CPU.beginProcess(process);
                    _Kernel.krnTrace("Processing PID " + process.getPID());
                    TSOS.Shell.updateRes();
                }
            } else if (readyQueue.isEmpty() && (process.getState() != "terminated")) {
                this.init();
                return;
            }
        };

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
        Scheduler.prototype.doSwitcheroo = function () {
            process.setPC(_CPU.PC);
            process.setAcc(_CPU.Acc);
            process.setIR(_CPU.IR);
            process.setXReg(_CPU.XReg);
            process.setYReg(_CPU.YReg);
            process.setZFlag(_CPU.ZFlag);
            process.setState(2); // waiting state
            readyQueue.enqueue(process);
            _CPU.showCPU();
        };

        /**
        * FCFS Scheduling
        */
        Scheduler.prototype.fcfs = function () {
            if (readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();

                //if terminated, get the next process
                if (process.getState() == "terminated") {
                    this.fcfs();
                }

                if (process.getLocation() == "disk") {
                    _Kernel.loadFromDisk();
                }

                if (process.getLocation() == "memory") {
                    process.setState(1);
                    _CPU.beginProcess(process);
                    _Kernel.krnTrace("\nPROCESSING PID: " + process.getPID() + "\n");
                    TSOS.Shell.updateRes();
                }
            } else if ((process.getState() != "terminated") && readyQueue.isEmpty()) {
                //                residentQueue.splice(0,residentQueue.length); // clear resident Queue as well!
                return;
            }
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
