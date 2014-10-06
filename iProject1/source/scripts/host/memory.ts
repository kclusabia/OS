/* ------------
 ADD Description
 ------------ */
module TSOS {
    export class Memory {
        constructor() {
        }

        public static newTable() {
            var memTable = "<table>";
            _MemoryArray = new Array();
            for (var i = 0; i <= _MemorySize; i += 8) {
                memTable += "<tr>";
                _MemoryArray[i] = "00x" + i.toString(16);
                memTable += "<td>" + _MemoryArray[i] + "</td>";
                var j = i + 1;
                while (j != i + 7) {
                    _MemoryArray[j] = 0;
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
                memTable += "</table>";
                document.getElementById("memoryTable").innerHTML = memTable;
        }
    }
}