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
            return memory.readMem(index + process.getBase());
        };

        MemoryManager.prototype.loadMemory = function (data1, base) {
            memory.loadProgram(data1, base);
        };

        // Stores the data into the specified address, denoted by the index.
        MemoryManager.prototype.storeData = function (index, data) {
            memory.storeData(index + process.getBase(), data);
        };

        MemoryManager.prototype.updateMemory = function () {
            return memory.updateMem();
        };

        MemoryManager.prototype.clearMemory = function () {
            memory.clearMem();
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
