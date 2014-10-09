/* ------------
ADD Description
------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory() {
        }
        Memory.newTable = function () {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i <= _MemorySize; i += 8) {
                // Creating a row of 256 bytes.
                memTable += "<tr>";
                _MemoryArray[i] = "00x" + i.toString(16);

                // Printing the base address
                memTable += "<td>" + _MemoryArray[i] + "</td>";
                var j = i + 1;

                while (j != i + 8) {
                    _MemoryArray[j] = 00;
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
            memTable += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };

        Memory.prototype.loadProgram = function (input) {
            // input=input.toString();
            input = input.trim();
            var x = 0;
            var y = 2;

            for (var row = 0; row < input.length; row += 8) {
                for (var col = row + 1; col <= row + 7; col++) {
                    _MemoryArray[j] = input.substring(x, y);
                    x = x + 2;
                    y = y + 2;
                }
            }
            this.storeInMemory();
        };

        Memory.prototype.storeInMemory = function () {
            var memTable = "<table>";

            for (var i = 0; i <= _MemorySize; i += 8) {
                table += "<tr>";
                _MemoryArray[i] = "00x" + i.toString(16);
                table += "<td>" + _MemoryArray[i] + "</td>";

                for (var j = i + 1; j <= i + 7; j++) {
                    table += "<td>" + _MemoryArray[j] + "</td>";
                }
                table += "</tr>";
            }
            table += "</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
