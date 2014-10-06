/* ------------
ADD Description
------------ */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(memoryData, memSize) {
            if (typeof memoryData === "undefined") { memoryData = []; }
            if (typeof memSize === "undefined") { memSize = 256; }
            this.memoryData = memoryData;
            this.memSize = memSize;
        }
        Memory.prototype.init = function () {
            //TODO
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
