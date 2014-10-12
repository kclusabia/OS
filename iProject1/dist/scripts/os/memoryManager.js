/**
* Created by kara2 on 10/8/14.
*/
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            //  memory = new Memory();
        }
        MemoryManager.prototype.readMemory = function (index) {
            return _MemoryArray[index];
        };

        MemoryManager.prototype.storeData = function (index, data) {
            _Memory.storeData(index, data);
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
