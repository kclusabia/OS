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

        FileSystemDeviceDriver.prototype.format = function () {
            this.createFileSystem();
            this.createMBR();
            _StdOut.putText("Formatting...done!");
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

        FileSystemDeviceDriver.prototype.getAvailMetaDir = function () {
            for (var t = 0; t < 1; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = localStorage.getItem(key);
                        if (metadata.substring(0, 1) == 0) {
                            return key;
                        }
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.getAvailMetaData = function () {
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = localStorage.getItem(key);
                        if (metadata.substring(0, 1) == 0) {
                            return key;
                        }
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.create = function (filename1) {
            var metaKey = this.getAvailMetaDir();
            var metaIndex = this.getAvailMetaData();

            var filename = this.convertToHex(filename1);
            var pad = this.addZeros("1" + metaIndex + filename, this.metaDataSize);
            localStorage.setItem(metaKey, pad);
            this.updateFileSystem();
            _StdOut.putText("Created the file called: " + this.convertToString(filename));
            /////
        };

        FileSystemDeviceDriver.prototype.write = function (file, contents) {
            var t = 0;
            var readKey = "";
            var pad;

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = localStorage.getItem(newKey);
                    var haha = metadata.slice(0, 1);
                    var f = metadata.slice(4, this.metaDataSize);
                    var hexString = this.convertToHex(file);
                    pad = this.addZeros(hexString, (this.metaDataSize - 4));
                    if (haha == "1" && (pad == f)) {
                        readKey = metadata.slice(1, 4);
                        break;
                    }
                }
            }

            localStorage.setItem(readKey, "1---" + this.addZeros(this.convertToHex(contents), (this.metaDataSize - 4)));
            this.updateFileSystem();
            //            var contents:string = "";
            //            contents = this.convertToHex(str);
            //            var dataKey = this.getAvailMetaDir();
            //            localStorage.setItem(dataKey, contents);
            //            this.updateFileSystem();
            //            _StdOut.putText("Done writing!");
        };

        FileSystemDeviceDriver.prototype.convertToHex = function (stringName) {
            var str = "";
            for (var i = 0; i < stringName.length; i++) {
                str += stringName.charCodeAt(i).toString(16);
            }
            return str;
        };

        FileSystemDeviceDriver.prototype.convertToString = function (hexValue) {
            var hex = "";
            for (var i = 0; i < hexValue.length; i++) {
                var a = hexValue.charAt(i);
                var b = hexValue.charAt(i + 1);
                hex += String.fromCharCode(parseInt((a + b), 16)).toString();
                i++;
            }
            return hex;
        };

        FileSystemDeviceDriver.prototype.addZeros = function (name, length) {
            var str = "";
            if (name.length < length) {
                var len = name.length;
                for (var i = len; i < length; i++) {
                    str += "0";
                }
            }
            name += str;
            return name;
        };
        return FileSystemDeviceDriver;
    })();
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
