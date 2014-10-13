/**
* Created by kara2 on 10/8/14.
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            memory = new TSOS.Memory();
            memory.newTable();
        }
        MemoryManager.prototype.readMemory = function (index) {
            return memory.readMem(index);
        };

        MemoryManager.prototype.storeData = function (index, data) {
            TSOS.Memory.storeData(index, data);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
