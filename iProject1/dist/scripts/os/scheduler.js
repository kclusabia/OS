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

        /**
        * FCFS Scheduling
        */
        Scheduler.prototype.fcfs = function () {
            if (readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();

                //if terminated, get the next process
                if (process.getState() == "terminated") {
                    alert("hi");
                    process.setLocation("black-hole");
                    this.fcfs();
                }

                if (process.getLocation() == "disk") {
                    _Kernel.contextSwitchFCFS();
                    return;
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

        /**
        * Round Robin scheduling
        */
        Scheduler.prototype.rr = function () {
            if (readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();

                //if terminated, get the next process
                if (process.getState() == "terminated") {
                    this.rr();
                }

                if (process.getLocation() == "disk") {
                    _Kernel.contextSwitchRR();
                    return;
                }

                if (process.getLocation() == "memory") {
                    process.setState(1);
                    _CPU.beginProcess(process);
                    _Kernel.krnTrace("\nPROCESSING PID: " + process.getPID() + "\n");
                    TSOS.Shell.updateRes();
                }
            } else if ((process.getState() != "terminated") && readyQueue.isEmpty()) {
                return;
            }
        };

        /**
        * Priority Scheduling
        */
        Scheduler.prototype.priority = function () {
            if (readyQueue.getSize() > 0) {
                process = readyQueue.dequeue();

                //if terminated, get the next process
                if (process.getState() == "terminated") {
                    this.priority();
                }

                if (process.getLocation() == "disk") {
                    _Kernel.contextSwitchPriority();
                    return;
                }

                process.setState(1);
                _CPU.beginProcess(process);
                _Kernel.krnTrace("\nPROCESSING PID: " + process.getPID() + "\n");
                TSOS.Shell.updateRes();
            } else if ((process.getState() != "terminated") && readyQueue.isEmpty()) {
                //                residentQueue.splice(0,residentQueue.length); // clear resident Queue as well!
                return;
            }
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
