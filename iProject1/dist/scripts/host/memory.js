/* ------------
ADD Description
------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
        }
        // Creates the memory table consisting of an array.
        Memory.prototype.newTable = function () {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i <= _MemorySize; i += 8) {
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
        Memory.prototype.loadProgram = function (data) {
            //TODO change function
            var input = data.replace(/^\s+|\s+$/g, '');
            input = input.trim();

            var x = 0;
            var y = x + 2;
            for (var row = 0; row < input.length / 2; row += 8) {
                for (var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = input.substring(x, y);
                    x = y + 1;
                    y = y + 3;
                }
            }
            this.updateMem();
        };

        // Stores the loaded program into the memory array.
        Memory.prototype.updateMem = function () {
            var memTable = "<table>";

            for (var i = 0; i <= _MemorySize; i += 8) {
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
        };

        Memory.prototype.clearMem = function () {
            return this.newTable();
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
