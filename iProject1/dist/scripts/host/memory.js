/* ------------
ADD Description
------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
        }
        Memory.prototype.newTable = function () {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i <= _MemorySize; i += 8) {
                // Creating a row of 256 bytes.
                memTable += "<tr>";

                //Base
                memTable += "<td>" + "00x" + i.toString(16);
                var j = i;

                while (j <= i + 7) {
                    _MemoryArray[j] = j;
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
            memTable += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };

        Memory.prototype.loadProgram = function (xth) {
            // input=input.toString();
            //TODO change function
            var input = xth.replace(/^\s+|\s+$/g, '');
            input = xth.trim(); //

            var x = 0;
            var y = x + 2;
            for (var row = 0; row < input.length / 2; row += 8) {
                for (var col = row; col <= row + 7; col++) {
                    _MemoryArray[col] = input.substring(x, y);
                    x = y + 1;
                    y = y + 3;

                    if (_MemoryArray[col] == "") {
                        _MemoryArray[col] = col;
                        x;
                        break;
                    }
                }
            }
            this.storeInMemory();
        };

        Memory.prototype.storeInMemory = function () {
            var memTable = "<table>";

            for (var i = 0; i <= _MemorySize; i += 8) {
                memTable += "<tr>";
                memTable += "<td>" + "00x" + i.toString(16) + "</td>";
                var j = i;
                while (j <= i + 7) {
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
            memTable += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
