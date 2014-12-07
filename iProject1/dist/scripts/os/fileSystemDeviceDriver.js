var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* Created by kara2 on 11/16/14.
*/
var TSOS;
(function (TSOS) {
    var FileSystemDeviceDriver = (function (_super) {
        __extends(FileSystemDeviceDriver, _super);
        function FileSystemDeviceDriver() {
            _super.call(this, this.aa, this.bb);
        }
        FileSystemDeviceDriver.prototype.aa = function () {
            this.trackSize = 4;
            this.sectorSize = 8;
            this.blockSize = 8;
            this.metaDataSize = 64;
        };

        FileSystemDeviceDriver.prototype.bb = function () {
        };

        FileSystemDeviceDriver.prototype.printData = function () {
            var dataFile = "";
            for (var bytes = 0; bytes < this.metaDataSize; bytes++) {
                dataFile += "0";
            }
            return dataFile;
        };

        FileSystemDeviceDriver.prototype.createMBR = function () {
            var mbr = this.createKey(0, 0, 0);
            var str = "Shit";
            var mbrData = "";
            mbrData = "1---" + this.addZeros(this.convertToHex(str), (this.metaDataSize - 4));
            sessionStorage.setItem(mbr, mbrData);
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
                        sessionStorage.setItem(key, _metaData);

                        var metaData = sessionStorage.getItem(key);
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

                        var metaData = sessionStorage.getItem(key);
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

        /**
        * Gets the free directory block to create files in disk.
        * @returns {string}
        */
        FileSystemDeviceDriver.prototype.getAvailMetaDir = function () {
            for (var t = 0; t < 1; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = sessionStorage.getItem(key);
                        if (metadata.substring(0, 1) == "0") {
                            return key;
                        }
                    }
                }
            }
        };

        /**
        * Gets the free data block, so contents can be written in.
        * @returns {string}
        */
        FileSystemDeviceDriver.prototype.getAvailMetaData = function () {
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = sessionStorage.getItem(key);
                        if (metadata.substring(0, 1) == "0") {
                            return key;
                        }
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.create = function (filename1) {
            var filenames = new Array();
            var metaKey = this.getAvailMetaDir();
            var metaIndex = this.getAvailMetaData();

            if (metaKey == "07") {
                _StdOut.putText("Disk has reached its capacity. Try again later.");
                return;
            }

            //TODO make filenames unique
            //            for(var i=0; i<filenames.length-1; i++) {
            //                if(filename1 == filenames[i]) {
            //                    alert("same");
            //                    _StdOut.putText("Filename already exist. Be unique. Make a new one.");
            //                    break;
            //                }
            //                  filenames.push(filename1);
            //                   // break;
            //                }
            var filename = this.convertToHex(filename1);
            var pad = this.addZeros("1" + metaIndex + filename, this.metaDataSize);
            sessionStorage.setItem(metaKey, pad);
            this.updateFileSystem();
            _StdOut.putText("Created the file called: " + this.convertToString(filename));
            /////
        };

        FileSystemDeviceDriver.prototype.write = function (file, contents) {
            var t = 0;
            var readKey = "";
            var paddedFN;
            var paddedContents;
            var firstBlock = "";
            var remString = "";

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = sessionStorage.getItem(newKey);
                    var metaindex = metadata.slice(0, 1);
                    var fn = metadata.slice(4, this.metaDataSize);
                    var hexString = this.convertToHex(file);
                    paddedFN = this.addZeros(hexString, (this.metaDataSize - 4));

                    // checking if filename is the same as filename passed
                    if (metaindex == "1" && (paddedFN == fn)) {
                        readKey = metadata.slice(1, 4);
                        break;
                    }
                }
            }

            // TODO dealing with contents that are > 60 bytes.
            var contentsInHex = this.convertToHex(contents);
            var blockSize = 60;

            // count length of contentsInHex divide 60 = that
            if (contentsInHex.length > blockSize) {
                var begin = contentsInHex.substring(0, 1);
                var last = contentsInHex.substring(blockSize, (blockSize + 1));

                // get the first set of string that can fit in first avail data block.
                firstBlock = contentsInHex.substring(begin, last);
                begin = last;
                last = contentsInHex.substring(begin, blockSize + 1);
            }
            paddedContents = this.addZeros(contentsInHex, (blockSize));
            sessionStorage.setItem(readKey, "1---" + paddedContents);
            _StdOut.putText("Contents were written on the file.");
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.read = function (file) {
            var t = 0;
            var tData = 1;
            var readKey = "";
            var paddedFN;
            var contents = "";

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    // goes through the directory
                    var newKey = this.createKey(t, s, b);
                    var metadata = sessionStorage.getItem(newKey);

                    // 1 if in use
                    var metaindex = metadata.slice(0, 1);

                    var fn = metadata.slice(4, this.metaDataSize);
                    var hexString = this.convertToHex(file);
                    paddedFN = this.addZeros(hexString, (this.metaDataSize - 4));
                    if (metaindex == "1" && (paddedFN == fn)) {
                        readKey = metadata.slice(1, 4);
                    }
                }
            }
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    // data TSB
                    var newKey1 = this.createKey(tData, s, b);
                    var metadata1 = sessionStorage.getItem(newKey1);
                    var metaindex1 = metadata1.substring(0, 1);
                    if (metaindex1 == "1" && (readKey == newKey1)) {
                        contents = metadata1.substring(4, this.metaDataSize);
                        var contents1 = this.convertToString(contents);
                    }
                }
            }
            this.updateFileSystem();
            _StdOut.putText("File contains: " + contents1);
        };

        FileSystemDeviceDriver.prototype.delete = function (file) {
            var t = 0;
            var tData = 1;
            var readKey = "";
            var paddedFN;
            var contents = "";
            var str = "";

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    // goes through the directory
                    var newKey = this.createKey(t, s, b);
                    var metadata = sessionStorage.getItem(newKey);

                    // 1 if in use
                    var metaindex = metadata.slice(0, 1);

                    var fn = metadata.slice(4, this.metaDataSize);
                    var hexString = this.convertToHex(file);
                    paddedFN = this.addZeros(hexString, (this.metaDataSize - 4));
                    if (metaindex == "1" && (paddedFN == fn)) {
                        readKey = metadata.slice(1, 4);
                    }
                }
            }
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    // data TSB
                    var newKey1 = this.createKey(tData, s, b);
                    var metadata1 = sessionStorage.getItem(newKey1);
                    var metaindex1 = metadata1.substring(0, 1);
                    if (metaindex1 == "1" && (readKey == newKey1)) {
                        sessionStorage.setItem(newKey1, "0000" + this.addZeros(str, this.metaDataSize - 4));
                        _StdOut.putText("File was deleted successfully!");
                    }
                }
            }
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.filesOnDisk = function () {
            var t = 0;
            var files = new Array();

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 1; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = sessionStorage.getItem(newKey);
                    var metaindex = metadata.slice(0, 1);
                    var fn = metadata.slice(4, this.metaDataSize);
                    var stringFilename = this.convertToString(fn);

                    //  paddedFN = this.addZeros(stringFilename, (this.metaDataSize - 4));
                    if (metaindex == "1") {
                        files.push(stringFilename);
                        //                        break;
                    }
                }
            }
            for (var i = 0; i < files.length; i++) {
                _StdOut.putText("File " + [i] + ": " + files[i]);
                _Console.advanceLine();
            }
            this.updateFileSystem();
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
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
