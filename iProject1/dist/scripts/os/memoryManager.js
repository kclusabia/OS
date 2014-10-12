/**
* Created by kara2 on 10/8/14.
*/
var TSOS;
(function (TSOS) {
    var memoryManager = (function () {
        function memoryManager() {
            memory = new TSOS.Memory();
        }
        memoryManager.prototype.readMemory = function (pc) {
            return _MemoryArray[pc];
        };
        return memoryManager;
    })();
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
