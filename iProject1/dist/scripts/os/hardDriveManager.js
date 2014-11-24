/**
* Created by kara2 on 11/16/14.
*/
var TSOS;
(function (TSOS) {
    var HardDriveManager = (function () {
        function HardDriveManager() {
            this.trackSize = 4;
            this.sectorSize = 8;
            this.blockSize = 8;
            this.mbr = 5;
            this.bytesPerBlock = 60;
            this.createFileSystem();
        }
        HardDriveManager.prototype.createFileSystem = function () {
            var fileSystemTable = "<table>";
            for (var t = 0; t < this.trackSize; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        fileSystemTable += "<tr><td>" + t + s + b + " ";

                        for (var m = 0; m < this.mbr; m++) {
                            // fileSystemTable += "<td>";
                            fileSystemTable += "<td>" + 0;
                        }

                        for (var bytes = 1; bytes < this.bytesPerBlock; bytes++) {
                            fileSystemTable += bytes;
                        }
                        fileSystemTable += "</td></tr>";
                        //
                    }
                }
            }
            document.getElementById("fileSystemTable").innerHTML = fileSystemTable + "</table>";
        };
        return HardDriveManager;
    })();
    TSOS.HardDriveManager = HardDriveManager;
})(TSOS || (TSOS = {}));
