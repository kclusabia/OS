/* ------------
ADD Description
------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
            this.base = 0;
        }
        // Creates the memory table consisting of an array.
        Memory.prototype.newTable = function () {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i < _MemorySize; i += 8) {
                // Creating a row of 256 bytes.
                memTable += "<tr>";

                //Base
                memTable += "<td>" + "0x" + i.toString(16);
                var j = i;

                while (j <= i + 7) {
                    _MemoryArray[j] = "00";
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
            memTable += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };

        // Loads the program into the memory.
        Memory.prototype.loadProgram = function (data, base) {
            var input = data.replace(/^\s+|\s+$/g, '');
            input = input.trim();

            var x = 0;
            var y = x + 2;
            for (var row = base; row < base + (data.length / 2); row += 8) {
                for (var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = data.substring(x, y);
                    x = y + 1;
                    y = y + 3;
                }
            }
            this.updateMem();
        };

        // Loads the program into the memory.
        Memory.prototype.loadWithoutSpaces = function (data, base) {
            var input = data.replace(/^\s+|\s+$/g, '');
            input = data.trim();
            var x = 0;
            var y = 2;
            for (var row = base; row < base + (input.length / 2); row += 8) {
                for (var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = input.substring(x, y);
                    x = y;
                    y += 2;
                }
            }
            this.updateMem();
        };

        // Stores the loaded program into the memory array.
        Memory.prototype.updateMem = function () {
            var memTable = "<table>";

            for (var i = 0; i < _MemorySize; i += 8) {
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
            memTable += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };

        // Displays the data in the specified index.
        Memory.prototype.readMem = function (index) {
            return _MemoryArray[index];
        };

        // Stores data in the specified index in memory.
        Memory.prototype.storeData = function (index, data) {
            _MemoryArray[index] = data;
            memoryMngr.updateMemory();
        };

        Memory.prototype.getBase = function () {
            if (residentQueue.length == 0) {
                this.base = 0;
                return this.base;
            } else if (residentQueue.length == 1) {
                this.base = 256;
                return this.base;
            } else if (residentQueue.length == 2) {
                this.base = 512;
                return this.base;
            } else {
                this.base = -1;
                return this.base;
            }
        };

        Memory.prototype.getLimit = function () {
            if (this.base != -1) {
                // alert("limit: " + parseInt(this.base+255));
                return parseInt(this.base + 255);
            } else
                return -1;
        };

        // Clears the memory and resetting the resident queue.
        Memory.prototype.clearMem = function () {
            for (var i = residentQueue.length - 1; i >= 0; i--) {
                var obj = residentQueue[i];
                residentQueue.splice(i, 1);
            }
            TSOS.Shell.updateRes();
            return this.newTable();
        };

        Memory.prototype.getWholeBlock = function (base) {
            var first = "";
            var second;
            for (var i = base; i < (base + 256); i++) {
                second = _MemoryArray[i];
                if (second.length == 1) {
                    first += "0" + second;
                } else {
                    first += second;
                }
            }
            return first;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
