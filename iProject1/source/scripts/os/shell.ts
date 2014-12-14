///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellPlace,
                                  "whereami",
                                  "- Returns your current location.");
            this.commandList[this.commandList.length] = sc;

            // givemeastring
            sc = new ShellCommand(this.shellWord,
                                  "givemeastring",
                                  "- Returns a sequence of characters.");
            this.commandList[this.commandList.length] = sc;

            // BSOD error
            sc = new ShellCommand(this.shellError,
                "bsod",
                "- Displays a BSOD error message.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                "status",
                "- Displays the current status.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                "load",
                "<string> - Checks if the input consisted of hex digits.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                "run",
                "- Runs the given program.");
            this.commandList[this.commandList.length] = sc;

            // run all loaded programs at once.
            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- Executes all the programs at once.");
            this.commandList[this.commandList.length] = sc;

            //TODO
            // kills an active process.
            sc = new ShellCommand(this.shellKill,
                "kill",
                "<pid> - Runs the given program.");
            this.commandList[this.commandList.length] = sc;

            //TODO
            // displays the PID of all active processes.
            sc = new ShellCommand(this.shellPs,
                "ps",
                "- Displays the PID of all active processes.");
            this.commandList[this.commandList.length] = sc;

            // displays the quantum.
            sc = new ShellCommand(this.shellSetQuantum,
                "quantum",
                "<number> - Sets the quantum. Default quantum is 6.");
            this.commandList[this.commandList.length] = sc;

            // clear memory
            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- Clears the memory.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // create a file in the File System Driver
            sc = new ShellCommand(this.shellCreateFile,
                "create",
                "<filename> - Creates a file in disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                "format",
                " - Formats the disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellReadFile,
                "read",
                "<filename> - Reads the file in disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWriteFile,
                "write",
                "<string> - Writes the file in disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDeleteFile,
                "delete",
                "<filename> - Deletes the file in disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellOnDisk,
                "ls",
                " - Returns the files on disk.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellSetSchedule,
                "setschedule",
                "<scheduler> - Sets a scheduler.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellGetSchedule,
                "getschedule",
                " - Gets the current scheduler.");
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
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
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
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
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellDate(args) {
            _StdOut.putText("" + new Date());
        }

        public shellPlace(args) {
            _StdOut.putText("You are currently in front of me...");
        }

        public shellWord(args) {
                var text = "";
                var possible = "abcdefghijklmnopqrstuvwxyz";
                var randomNum = Math.floor(Math.random() * 11)
                for( var i = 0; i < randomNum; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                _StdOut.putText("" + text);
        }

        public shellError(args) {
            var msg = "Error #007 occurred!";
            _Kernel.krnTrapError(msg);
        }

        public shellStatus(args) {
             document.getElementById("status").innerHTML = "Status: " + args.toString();
        }

        public shellLoad(args) {

            var priority = args[0];
            var hex =  document.getElementById("taProgramInput").value;
            var input = hex.replace(/\s/g,'');

            for (var i = 0; i < input.length; i++) {
                var ascii = input.charCodeAt(i);
                if ((ascii >= 65 && ascii <= 70) || (ascii >= 97 && ascii <= 102) ||
                    (ascii >= 48 && ascii <= 57) || (ascii == 32)) {
                    continue;
                }
                else {
                    _StdOut.putText("The input did not consist of hex digits. It was not valid.");
                    return;
                }
            }

            // Sets a default priority when priority scheduling is not called.
            var priority = args[0];
            if(priority == undefined || priority < 0){
                priority = 5;
            }

            if (residentQueue.length >= 3) {

                if(fileSystem.isFormatted){
                    pcb = new ProcessControlBlock();
                    pcb.newPCB(-1, -1, 0,priority);
                    pcb.setLocation("disk");

                    residentQueue.push(pcb);
                    garbageQueue.push(pcb);

                    Shell.updateRes();
                    fileSystem.rollOut(pcb,input.toString());
                    _StdOut.putText("Process ID: " + pcb.getPID());
                }else{
                    _StdOut.putText("Please format first...");
                }

            }else {
                _StdOut.putText("You have loaded the program successfully.");
                _Console.advanceLine();

                // Creating a PCB block.
                var base = memory.getBase();
                var limit = memory.getLimit();
                pcb = new ProcessControlBlock();
                pcb.newPCB(base, limit, 0,priority);         // (base, limit, state)
                pcb.setLocation("memory");

                //residentQueue = new Array<ProcessControlBlock>();
                residentQueue.push(pcb);
                garbageQueue.push(pcb);
                // Displays the current PID.
                _StdOut.putText("Process ID: " + pcb.getPID());
                memoryMngr.loadWithoutSpaces(input.toString(), base);
               // _Console.advanceLine();
                Shell.updateRes();
            }
        }

        // Updates the resident queue.
        public static updateRes() {
                var tableView = "<table>";
                tableView += "<th>PC</th>";
                tableView += "<th>Priority</th>";
                tableView += "<th>PID</th>";
                tableView += "<th>Base</th>";
                tableView += "<th>Limit</th>";
                tableView += "<th>IR</th>";
                tableView += "<th>XReg</th>";
                tableView += "<th>YReg</th>";
                tableView += "<th>ZFlag</th>";
                tableView += "<th>State</th>";
                tableView += "<th>Location</th>";
                for (var i = 0; i < garbageQueue.length; i++) {
                    var s:TSOS.ProcessControlBlock = garbageQueue[i];
                    if (s.getState() != "new") {
                    tableView += "<tr>";
                    var newPC = (s.getPC() + s.getProcessBase());
                    tableView += "<td>" + newPC.toString() + "</td>";
                    tableView += "<td>" + s.getPriority() + "</td>";
                    tableView += "<td>" + s.getPID().toString() + "</td>";
                    tableView += "<td>" + s.getProcessBase().toString() + "</td>";
                    tableView += "<td>" + s.getProcessLimit().toString() + "</td>";
                    tableView += "<td>" + s.getIR() + "</td>";
                    tableView += "<td>" + s.getXReg().toString() + "</td>";
                    tableView += "<td>" + s.getYReg().toString() + "</td>";
                    tableView += "<td>" + s.getZFlag().toString() + "</td>";
                    tableView += "<td>" + s.getState().toString() + "</td>";
                    tableView += "<td>" + s.getLocation().toString() + "</td>";
                    tableView += "</tr>";
                }
            }
                tableView += "</table>";
                document.getElementById("ReadyQueue").innerHTML = tableView;
        }

        public shellRun(args) {
            if(residentQueue[args].getState() == "new") {
                readyQueue.enqueue(residentQueue[args]);
                _KernelInterruptQueue.enqueue(new Interrupt(newProcess, 5));
            }
        }

        public shellRunAll() {

            if(schedulerType == "priority"){
                //sort by lower priority!
                for(var a = 0; a<residentQueue.length;a++){
                    for(var b = 1; b<residentQueue.length-a;b++){
                        var firstPriority:number = residentQueue[b-1].getPriority();
                        var secondPriority:number = residentQueue[b].getPriority();
                        if(firstPriority > secondPriority){
                            var current:TSOS.ProcessControlBlock = residentQueue[b-1];
                            residentQueue[b-1] = residentQueue[b];
                            residentQueue[b] = current;

                            garbageQueue[b-1] = garbageQueue[b];
                            garbageQueue[b] = current;
                        }
                    }
                }
            }

            for (var i=0; i < residentQueue.length; i++) {
                var s = TSOS.ProcessControlBlock =  residentQueue[i];
                    s.setState(3);
                readyQueue.enqueue(s);
                Shell.updateRes();
            }
            _KernelInterruptQueue.enqueue(new Interrupt(newProcess, 5));
        }

        public shellKill(args) {

            var killThisBitch:number = args[0];

            if (killThisBitch == process.getPID() && readyQueue.getSize() >= 0) {
                process.setState(4);            // set state to terminated
                Shell.updateRes();
                _StdOut.putText("PID " + args + " was murdered.");
                scheduler.init();
                _Kernel.krnInterruptHandler(newProcess, args);
            }

            // Can kill a process even though it is waiting.
            for (var i = 0; i < residentQueue.length; i++) {
                var obj:TSOS.ProcessControlBlock = residentQueue[i];
                if (killThisBitch == obj.getPID()) {

                    if(obj.getLocation() == "disk"){
                        obj.setState(4);
                        var fileOnDisk = "processfile"+obj.getPID();
                        fileSystem.deleteFile(fileOnDisk);
                        Shell.updateRes();
                        _StdOut.putText("Process " + args + " was murdered.");
                    }
                    if(obj.getLocation() == "memory") {
                        obj.setState(4);
                        Shell.updateRes();
                        _StdOut.putText("Process " + args + " was murdered.");
                    }
                }
            }
        }

        // Consider active processes that have a state of running or waiting.
        public shellPs(args) {
            var check:boolean = true;
            for (var i=0; i < residentQueue.length; i++) {
                var obj:TSOS.ProcessControlBlock = residentQueue[i];
                if(obj.getState() == "running" || obj.getState() == "waiting") {
                    check = false;
                    _StdOut.putText("Active processes are PID: " + obj.getPID());
                    _Console.advanceLine();
                }
            }

            if (check == true)
             _StdOut.putText("There are currently no active processes.");
        }

        public shellSetQuantum(args) {
            if(args <= 0) {
                quantum = 6;
                _StdOut.putText("Cannot have a quantum of 0. Setting to default = " + quantum);
            }
            else if(args.length > 0) {
                quantum = args;
                _StdOut.putText("Quantum was set to: " + quantum);
            }
        }

        public shellClearMem(args) {
            memoryMngr.clearMemory();
        }


        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
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
        }

        public shellTrace(args) {
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
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellCreateFile(args) {
            if(fileSystem.isFormatted){
                fileSystem.create(args.toString());
            }else{
                _StdOut.putText("please format first...");
            }
        }

        public shellFormat() {
            fileSystem.format();
        }

        public shellReadFile(args) {
            if(fileSystem.isFormatted){
                fileSystem.read(args.toString());
            }else{
                _StdOut.putText("please format first...");
            }
        }

        public shellWriteFile(args) {

            if(args.length < 2){
                _StdOut.putText("Write nothing?");
                return;
            }

            if(fileSystem.isFormatted){
                var filename = args[0];
                var firstArg = args[1];
                var lastArg  = args[args.length-1];
                var firstChar = firstArg.charAt(0);
                var lastChar = lastArg.charAt(lastArg.length-1);
                var firstAscii = firstChar.charCodeAt(0);
                var lastAscii = lastChar.charCodeAt(lastChar.length-1);
                var load:string = "";

                if(args.length == 2){
                    if((firstChar == lastChar) && (firstAscii == 34) && (lastAscii == 34)){
                        load += args[1].slice(1,(args[1].length-1));
                        fileSystem.write(filename,load);
                        return;
                    }else{
                        _StdOut.putText("File Contents must be between: \" \"");
                    }
                }

                if(args.length > 2){
                    if((firstChar == lastChar) && (firstAscii == 34) && (lastAscii == 34)){
                        load +=  args[1].slice(1,args[1].args) + " ";
                        load += " ";
                        for(var i = 2; i < args.length;i++){

                            if((i+1) == args.length){
                                load += lastArg.slice(0,args[i].length-1);
                                break;
                            }
                            load += args[i];
                            load += " ";
                        }
                        fileSystem.write(filename,load);
                    }else{
                        _StdOut.putText("File Contents must be between: \" \"");
                    }
                }
            }else{
                _StdOut.putText("Please format first...");
            }

        }

        public shellDeleteFile(args) {
            if(fileSystem.isFormatted){
                fileSystem.deleteFile(args.toString());
            }else{
                _StdOut.putText("Please format first...");
            }
        }

        // LS command
        public shellOnDisk() {
            if(fileSystem.isFormatted){
                fileSystem.filesOnDisk();
            }
            else{
                _StdOut.putText("Please format first...");
            }
        }

        public shellSetSchedule(args) {
            if (args.toString() == "rr" || args.toString() == "fcfs" || args.toString() == "priority") {
               schedulerType = args.toString();
                _StdOut.putText("Current scheduler is: " + schedulerType);
            }
            else
                _StdOut.putText("Don't make up your own scheduler please.");
        }

        public shellGetSchedule() {
            _StdOut.putText("Current scheduler is: " + schedulerType);
        }
    }
}
