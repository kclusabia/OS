///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new TSOS.ShellCommand(this.shellPlace, "whereami", "- Returns your current location.");
            this.commandList[this.commandList.length] = sc;

            // givemeastring
            sc = new TSOS.ShellCommand(this.shellWord, "givemeastring", "- Returns a sequence of characters.");
            this.commandList[this.commandList.length] = sc;

            // BSOD error
            sc = new TSOS.ShellCommand(this.shellError, "bsod", "- Displays a BSOD error message.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- Displays the current status.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Checks if the input consisted of hex digits.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- Runs the given program.");
            this.commandList[this.commandList.length] = sc;

            // run all loaded programs at once.
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Executes all the programs at once.");
            this.commandList[this.commandList.length] = sc;

            //TODO
            // kills an active process.
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Runs the given program.");
            this.commandList[this.commandList.length] = sc;

            //TODO
            // displays the PID of all active processes.
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Displays the PID of all active processes.");
            this.commandList[this.commandList.length] = sc;

            // displays the quantum.
            sc = new TSOS.ShellCommand(this.shellSetQuantum, "quantum", "<number> - Sets the quantum. Default quantum is 6");
            this.commandList[this.commandList.length] = sc;

            // clear memory
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears the memory.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
            userCommand = this.parseInput(buffer);

            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            //        if (_StdOut.currentYPosition > 0) {
            //            _StdOut.advanceLine();
            //        }
            // ... and finally write the prompt again.
            this.putPrompt();
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };

        Shell.prototype.shellDate = function (args) {
            _StdOut.putText("" + new Date());
        };

        Shell.prototype.shellPlace = function (args) {
            _StdOut.putText("You are currently in front of me...");
        };

        Shell.prototype.shellWord = function (args) {
            var text = "";
            var possible = "abcdefghijklmnopqrstuvwxyz";
            var randomNum = Math.floor(Math.random() * 11);
            for (var i = 0; i < randomNum; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            _StdOut.putText("" + text);
        };

        Shell.prototype.shellError = function (args) {
            var msg = "Error #007 occurred!";
            _Kernel.krnTrapError(msg);
        };

        Shell.prototype.shellStatus = function (args) {
            document.getElementById("status").innerHTML = "Status: " + args.toString();
        };

        Shell.prototype.shellLoad = function (args) {
            var input = document.getElementById("taProgramInput").value;

            for (var i = 0; i < input.length; i++) {
                var ascii = input.charCodeAt(i);
                if ((ascii >= 65 && ascii <= 70) || (ascii >= 97 && ascii <= 102) || (ascii >= 48 && ascii <= 57) || (ascii == 32)) {
                    continue;
                } else {
                    _StdOut.putText("The input did not consist of hex digits. It was not valid.");
                    return;
                }
            }
            if (residentQueue.length == 3) {
                _StdOut.putText("Memory is full");
            } else {
                _StdOut.putText("You have loaded the program successfully.");

                // Creating a PCB block.
                var base = memory.getBase();
                var limit = memory.getLimit();
                pcb = new TSOS.ProcessControlBlock();
                pcb.newPCB(base, limit, 0); // (base, limit, state)

                //residentQueue = new Array<ProcessControlBlock>();
                residentQueue.push(pcb);
                _Console.advanceLine();

                // Displays the current PID.
                _StdOut.putText("Process ID: " + pcb.getPID());
                memoryMngr.loadMemory(input.toString(), base);

                // _Console.advanceLine();
                Shell.updateRes();
            }
        };

        Shell.updateRes = function () {
            var tableView = "<table>";
            tableView += "<th>PID</th>";
            tableView += "<th>Base</th>";
            tableView += "<th>Limit</th>";
            tableView += "<th>State</th>";
            for (var i = 0; i < residentQueue.length; i++) {
                var s = residentQueue[i];
                tableView += "<tr>";
                tableView += "<td>" + s.getPID().toString() + "</td>";
                tableView += "<td>" + s.getBase().toString() + "</td>";
                tableView += "<td>" + s.getLimit().toString() + "</td>";
                tableView += "<td>" + s.getState().toString() + "</td>";
                tableView += "</tr>";
            }
            tableView += "</table>";
            document.getElementById("ResidentQueue").innerHTML = tableView;
        };

        Shell.prototype.shellRun = function (args) {
            if (residentQueue[args].getState() == "new") {
                alert("hi");
                readyQueue.enqueue(residentQueue[args]);
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(newProcess, 5));
            }
        };

        Shell.prototype.shellRunAll = function () {
            for (i = 0; i < residentQueue.length; i++) {
                readyQueue.enqueue(residentQueue[i]);
            }
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(newProcess, 5));
        };

        //TODO dequeue the process from ready and ?resident?.
        Shell.prototype.shellKill = function (args) {
            if (args == process.getPID()) {
                residentQueue.splice(process.getPID(), 1); // remove the process with that PID from the resident queue.
                process.setState(4);
                _StdOut.putText("Process " + args + " was murdered.");
                process.updatePCB();
            }
        };

        //TODO make sure to dequeue the terminated process from ready
        Shell.prototype.shellPs = function (args) {
            for (i = 0; i < residentQueue.length; i++) {
                var obj = residentQueue[i];
                if (obj.getState() == "running") {
                    _StdOut.putText("PID: " + obj.getPID());
                    _Console.advanceLine();
                }
                //                else {
                //                    _StdOut.putText("There are currently no active processes.");
                //                    _Console.advanceLine();
                //                    _OsShell.putPrompt();
                //                }
            }
        };

        Shell.prototype.shellSetQuantum = function (args) {
            if (args <= 0) {
                quantum = 6;
                _StdOut.putText("Cannot have a quantum of 0. Setting to default = " + quantum);
            } else if (args.length > 0) {
                quantum = args;
                _StdOut.putText("Quantum was set to: " + quantum);
            }
        };

        Shell.prototype.shellClearMem = function (args) {
            memoryMngr.clearMemory();
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };

        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };

        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
