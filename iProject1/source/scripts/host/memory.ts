/* ------------
 ADD Description
 ------------ */
module TSOS {
    export class Memory {
        constructor() {
        }

        public newTable() {
            var memTable = "<table>";
            _MemoryArray = new Array();

            for (var i = 0; i <= _MemorySize; i += 8) {
                // Creating a row of 256 bytes.
                memTable += "<tr>";
                _MemoryArray[i] = i.toString(10);
                // Printing the base address
                memTable += "<td>" + _MemoryArray[i] + "</td>";
                var j = i;
                // Setting the memory to 0.
                while (j != i + 8) {
                    _MemoryArray[j] = j;
                    memTable += "<td>" + _MemoryArray[j] + "</td>";
                    j++;
                }
                memTable += "</tr>";
            }
                memTable += "</table>";
                document.getElementById("memoryTable").innerHTML = memTable;
        }

        public loadProgram(input) {
           // input=input.toString();
            input = input.trim();
            var x = 0;
            var y = 2;
            alert(input.toString());
            for(var row = 0; row < input.length/2; row += 8) {
                for(var col = row + 1; col <= row + 7; col++) {
                    _MemoryArray[col] = input.substring(x,y);
                    x = x+2;
                    y = y+2;
                }
            }
            this.storeInMemory();
        }

        public storeInMemory(){
            var memTable = "<table>";

            for(var i=0; i<=_MemorySize;i+=8) {

                table += "<tr>";
                _MemoryArray[i] = "00x" + i.toString(16);
                table += "<td>" + _MemoryArray[i] + "</td>";

                for(var j=i+1; j<=i+9;j++) {
                    table += "<td>" + _MemoryArray[j] + "</td>";
                }
                table += "</tr>";
            }
            table +="</table>";
            document.getElementById("memoryTable").innerHTML = memTable;
        }




    }
}