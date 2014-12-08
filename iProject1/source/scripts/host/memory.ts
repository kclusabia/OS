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
            for(var row = base; row < base + (data.length/2); row += 8) {
                for(var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = data.substring(x,y);
                    x = y+1;
                    y = y+3;
                }
            }
            this.updateMem();
        }

        // Loads the program into the memory.
        public loadWithoutSpaces(data, base) {

            var x = 0;
            var y = 2;
            for(var row = base; row < base + (data.length/2); row += 8) {
                for(var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = data.substring(x,y);
                    x = y;
                    y += 2;
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
            memoryMngr.updateMemory();
        }

        public getBase() {
            if(residentQueue.length == 0) {
                this.base = 0;
                return this.base;
            }
            else if(residentQueue.length == 1) {
                this.base = 256;
                return this.base;
            }
            else if (residentQueue.length == 2) {
                this.base = 512;
                return this.base;
            }
            else {
                this.base = -1;
                return this.base;
            }


//            if(residentQueue.length >= 3){
//                return -1;
//            }else {
//
//                for (var base = 0; base <= (256 * 2); base += 256) {
//                    var address = _MemoryArray.readMem(base);
//                    if (address == "00") {
//                        return base;
//                    }
//                }
//            }
        }

        public getLimit():number {
            if(this.base != -1) {
               // alert("limit: " + parseInt(this.base+255));
                return parseInt(this.base+255);
            }
            else
                return -1;
        }

        // Clears the memory and resetting the resident queue.
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