/* ------------
 ADD Description
 ------------ */
module TSOS {
    export class Memory {

        public base:number = 0;
        constructor() {
        }

        // Creates the memory table consisting of an array.
        public newTable() {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i < _MemorySize; i += 8) {
                // Creating a row of 256 bytes.
                memTable += "<tr>";
                //Base
                memTable += "<td>" + "0x" + i.toString(16);
                var j = i;
                // Setting the memory to 0.
                while (j <= i+7) {
                    _MemoryArray[j] = "00";
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
                memTable += "</table>";
                document.getElementById("memoryTable").innerHTML = memTable;
        }

        // Loads the program into the memory.
        public loadProgram(data, base) {
            var input = data.replace(/^\s+|\s+$/g,''); 
            input = input.trim();

            var x = 0;
            var y = x+2;
            for(var row = base; row < base + (input.length/2); row += 8) {
                for(var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = input.substring(x,y);
                    x = y+1;
                    y = y+3;
                }
            }
            this.updateMem();
        }

        // Stores the loaded program into the memory array.
        public updateMem(){
            var memTable = "<table>";

            for(var i = 0; i < _MemorySize; i+=8) {

                memTable += "<tr>";
                memTable += "<td>" + "00x" + i.toString(16) + "</td>";
                var j = i;
                while (j <= i + 7) {
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    if (_MemoryArray[j] == "") {
                        _MemoryArray[j] = "00";
                    }
                    j++;
                }
                memTable += "</tr>";
            }
            memTable +="</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        }

        // Displays the data in the specified index.
        public readMem(index:number) {
            return _MemoryArray[index];
        }

        // Stores data in the specified index in memory.
        public storeData(index, data) {
            _MemoryArray[index] = data;
        }

        public getBase() {
            if(residentQueue.length == 0) {
                this.base = 0;
               // alert("base: " + this.base);
                return this.base;
            }
            else if(residentQueue.length == 1) {  //TODO && (residentQueue[0].getState() != "running" || residentQueue[0].getState() != "waiting")) {
                this.base = 256;
               // alert("base: " + this.base);
                return this.base;
            }
            else if (residentQueue.length == 2) {
                this.base = 512;
              //  alert("base: " + this.base);
                return this.base;
            }
            else {
                this.base = -1;
                return this.base;
            }
        }

        public getLimit():number {
            if(this.base != -1) {
               // alert("limit: " + parseInt(this.base+255));
                return parseInt(this.base+255);
            }
            else
                return -1;
        }

        // Clear the memory and resetting the resident queue.
        public clearMem() {
            _StdOut.putText("Memory cleared! Processes has been terminated!");
            for (var i = residentQueue.length - 1; i >= 0; i--) {
                var obj:TSOS.ProcessControlBlock = residentQueue[i];
                residentQueue.splice(i, 1);
                }
            Shell.updateRes();
            return this.newTable();
        }



    }
}