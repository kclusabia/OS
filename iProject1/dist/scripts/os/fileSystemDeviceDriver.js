/**
* Created by kara2 on 11/16/14.
*/
var TSOS;
(function (TSOS) {
    var FileSystemDeviceDriver = (function () {
        function FileSystemDeviceDriver() {
            this.trackSize = 4;
            this.sectorSize = 8;
            this.blockSize = 8;
            this.metaDataSize = 64;
            this.createFileSystem();
            this.createMBR();
        }
        FileSystemDeviceDriver.prototype.printData = function () {
            var dataFile = "";
            for (var bytes = 0; bytes < this.metaDataSize; bytes++) {
                dataFile += "0";
            }
            return dataFile;
        };

        FileSystemDeviceDriver.prototype.createMBR = function () {
            var mbr = this.createKey(0, 0, 0);
            localStorage.setItem(mbr, "1---mbr");
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.createFileSystem = function () {
            var fileSystemTable = "<table>";

            for (var t = 0; t < this.trackSize; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        // TSB block acts as the key.
                        var key = this.createKey(t, s, b);

                        var _metaData = this.printData();
                        localStorage.setItem(key, _metaData);

                        var metaData = localStorage.getItem(key);
                        var meta = metaData.substring(0, 4);
                        var data = metaData.substring(4, this.metaDataSize);
                        fileSystemTable += "<tr><td>" + t + s + b;

                        fileSystemTable += "<td>" + meta + "<td>" + data;

                        fileSystemTable += "</td></tr>";
                        //
                    }
                }
            }
            document.getElementById("fileSystemTable").innerHTML = fileSystemTable + "</table>";
        };

        FileSystemDeviceDriver.prototype.updateFileSystem = function () {
            var fileSystemTable = "<table>";

            for (var t = 0; t < this.trackSize; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        // TSB block acts as the key.
                        var key = this.createKey(t, s, b);

                        var metaData = localStorage.getItem(key);
                        var meta = metaData.substring(0, 4);
                        var data = metaData.substring(4, this.metaDataSize);
                        fileSystemTable += "<tr><td>" + t + s + b;

                        fileSystemTable += "<td>" + meta + "<td>" + data;

                        fileSystemTable += "</td></tr>";
                        //
                    }
                }
            }
            document.getElementById("fileSystemTable").innerHTML = fileSystemTable + "</table>";
        };

        FileSystemDeviceDriver.prototype.createKey = function (t, s, b) {
            return String(t) + String(s) + String(b);
        };

        FileSystemDeviceDriver.prototype.getMetaIndex = function () {
            var t = 0;
        };

        FileSystemDeviceDriver.prototype.create = function (args) {
            //TODO
        };
        return FileSystemDeviceDriver;
    })();
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
