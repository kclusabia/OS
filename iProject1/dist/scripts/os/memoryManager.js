/**
* Created by kara2 on 10/8/14.
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        // Creates a memory object. The memory table is also created.
        function MemoryManager() {
            memory = new TSOS.Memory();
            memory.newTable();
        }
        // Reads the data from the specified address, denoted as the index.
        MemoryManager.prototype.readMemory = function (index) {
            return memory.readMem(index);
        };

        // Stores the data into the specified address, denoted by the index.
        MemoryManager.prototype.storeData = function (index, data) {
            memory.storeData(index, data);
        };

        MemoryManager.prototype.updateMemory = function () {
            return memory.updateMem();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
