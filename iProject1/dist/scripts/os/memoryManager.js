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
            if (process.getProcessBase() + index >= process.getProcessLimit + index || process.getProcessBase() + index < process.getProcessBase) {
                _Console.ifError();
            }
            return memory.readMem(parseInt(index + process.getProcessBase()));
        };

        MemoryManager.prototype.loadMemory = function (data1, base) {
            if (process.getProcessBase() + index >= process.getProcessLimit + index || process.getProcessBase() + index < process.getProcessBase) {
                _Console.ifError();
            }
            memory.loadProgram(data1, base);
        };

        MemoryManager.prototype.loadWithoutSpaces = function (data1, base) {
            memory.loadWithoutSpaces(data1, base);
        };

        // Stores the data into the specified address, denoted by the index.
        MemoryManager.prototype.storeData = function (index, data) {
            return memory.storeData(parseInt(index + process.getProcessBase()), data);
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
