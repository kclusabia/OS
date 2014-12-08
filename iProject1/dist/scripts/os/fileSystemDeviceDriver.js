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
            this.dataSize = 60;
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
        FileSystemDeviceDriver.prototype.getAvailMetaDir = function (file) {
            for (var t = 0; t < 1; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = sessionStorage.getItem(key);
                        var meta = metadata.slice(0, 1);
                        var data = metadata.slice(4, metadata.length);
                        if ((file == data)) {
                            return "-1";
                        } else if (meta == "0") {
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

        FileSystemDeviceDriver.prototype.create = function (filename) {
            var hex = this.convertToHex(filename);
            var pad = this.addZeros(hex, this.dataSize);
            var metaKey = this.getAvailMetaDir(pad);
            var zero = this.addAllZeros(this.dataSize);
            if (metaKey == "-1") {
                _StdOut.putText("File name already exist.");
                return;
            }

            var metaIndex = this.getAvailMetaData();

            if (metaKey == "07") {
                _StdOut.putText("Disk has reached its capacity. Try again later.");
                return;
            }
            sessionStorage.setItem(metaKey, "1" + metaIndex + pad); //create the file
            sessionStorage.setItem(metaIndex, "1---" + zero); //mark taken
            this.updateFileSystem();
            _StdOut.putText("Created the file called: " + filename);
            /////
        };

        FileSystemDeviceDriver.prototype.write = function (file, contents) {
            var t = 0;
            var readKey = "";
            var paddedFN;
            var paddedContents;
            var firstBlock = "";

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
            var contentsInHex = this.convertToHex(contents);
            paddedContents = this.addZeros(contentsInHex, (this.dataSize));

            if (paddedContents.length < this.dataSize) {
                sessionStorage.setItem(readKey, "1---" + paddedContents);
                _StdOut.putText("Contents were written on the file.");
            } else {
                //call a method that does > 60 bytes
                this.writeMoreBlocks(readKey, contentsInHex);
                _StdOut.putText("Contents were written on the file.");
            }
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.writeMoreBlocks = function (startKey, paddedContents) {
            var howMany = Math.ceil((paddedContents.length) / (this.dataSize));
            var totalAddresses = new Array();

            //get more keys starting
            totalAddresses = this.getTotalAddresses(startKey, (howMany - 1));

            var begin = 0;
            var end = this.dataSize;
            var data = "";

            for (var i = 0; i < totalAddresses.length; i++) {
                data = paddedContents.slice(begin, end);
                var key = this.createNewKey(totalAddresses[i]);

                if (i + 1 < totalAddresses.length) {
                    var nextKey = this.createNewKey(totalAddresses[i + 1]);
                    sessionStorage.setItem(key, "1" + nextKey + data);
                } else {
                    var pad = this.addZeros(data, this.dataSize);
                    sessionStorage.setItem(key, "1---" + pad);
                }

                if (end == paddedContents.length) {
                    break;
                }

                if ((end + this.dataSize) > (paddedContents.length)) {
                    begin = end;
                    end = (paddedContents.length);
                } else {
                    begin = end;
                    end = (end + this.dataSize);
                }
            }
        };

        FileSystemDeviceDriver.prototype.createNewKey = function (key) {
            var t = key.charAt(0);
            var s = key.charAt(1);
            var b = key.charAt(2);
            return this.createKey(t, s, b);
        };

        FileSystemDeviceDriver.prototype.getTotalAddresses = function (startKey, end) {
            var addressArray = new Array();
            var done = false;
            addressArray.push(startKey);

            for (var t = 1; t < this.trackSize; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var data = sessionStorage.getItem(key);
                        var meta = data.slice(0, 1);

                        if ((key == "377") && (addressArray.length < (end + 1))) {
                            _StdOut.putText("Not enough space sorry!");
                            return;
                        }
                        if (meta == "0") {
                            addressArray.push(key);
                            if (addressArray.length == (end + 1)) {
                                done = true;
                                break;
                            }
                        }
                    }
                    if (done) {
                        break;
                    }
                }
                if (done) {
                    break;
                }
            }
            return addressArray;
        };

        FileSystemDeviceDriver.prototype.read = function (file) {
            var t1 = 0;
            var readKey;
            var out = false;

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t1, s, b);
                    var metadata = sessionStorage.getItem(newKey);
                    var metaindex = metadata.slice(0, 1);
                    var meta = metadata.slice(1, 4);
                    var fn = metadata.slice(4, metadata.length);
                    var hexString = this.convertToHex(file);
                    var paddedFN = this.addZeros(hexString, this.dataSize);

                    // checking if filename is the same as filename passed
                    if ((metaindex == "1") && (paddedFN == fn)) {
                        readKey = meta;
                        out = true;
                        break;
                    }
                }
                if (out) {
                    break;
                }
            }

            if (readKey == "---") {
                //no chain
            } else {
                //has a chain
                var print;
                for (var t = readKey.charAt(0); t < this.trackSize; t++) {
                    for (var s = readKey.charAt(1); s < this.sectorSize; s++) {
                        for (var b = readKey.charAt(2); b < this.blockSize; b++) {
                            var key = this.createKey(t, s, b);
                            var data = sessionStorage.getItem(key);
                            var nextKey = data.slice(1, 4);
                            if (nextKey == "---") {
                                print = data.slice(4, data.length);
                                _StdOut.putText(this.convertToString(print.toString()));
                                return;
                            } else {
                                print = data.slice(4, data.length);
                                _StdOut.putText(this.convertToString(print.toString()));
                            }
                            key = nextKey;
                        }
                    }
                }
            }
            this.updateFileSystem();
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

        FileSystemDeviceDriver.prototype.addAllZeros = function (length) {
            var str = "";

            for (var i = 0; i < length; i++) {
                str += "0";
            }
            return str;
        };

        //writing to disk
        FileSystemDeviceDriver.prototype.rollOut = function (program) {
            var newFile = "processfile" + pcb.getPID();
            this.create(newFile);
            this.write(newFile, program);
        };

        FileSystemDeviceDriver.prototype.getNextAddress = function (filename) {
            var t = 0;
            var key;
            var zero = this.addAllZeros(this.metaDataSize);
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    key = this.createKey(t, s, b);
                    var data = sessionStorage.getItem(key);
                    var inUse = data.slice(0, 1);
                    var meta = data.slice(1, 4);
                    var hexData = data.slice(4, data.length);
                    if ((filename == hexData) && (inUse == "1")) {
                        //found what we are looking for...
                        sessionStorage.setItem(key, zero); //delete the contents
                        return meta;
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.loadFromDisk = function (processOnDisk, processOnMem) {
            alert("loading from the disk");
            var data;
            var zeroData = this.addAllZeros(this.metaDataSize);

            //search for a filename
            var filename = "processfile" + processOnDisk.getPID();
            var fileHex = this.convertToHex(filename.toString());
            var padFile = this.addZeros(fileHex, this.dataSize);

            var dataIndex = this.getNextAddress(padFile);

            //get the data of the file
            //grab everything in hex!!!!
            data = this.getProgramContents(dataIndex);
            sessionStorage.setItem(dataIndex, zeroData);

            processOnDisk.setProcessBase(0);
            processOnDisk.setProcessLimit(255);
            TSOS.Shell.updateRes();

            //load current process into the mem
            memoryMngr.loadWithoutSpaces(data.toString(), processOnDisk.getProcessBase());
            this.updateFileSystem();
            memoryMngr.updateMemory();
        };

        FileSystemDeviceDriver.prototype.getProgramContents = function (index) {
            var value = "";
            var key;
            var data;
            var nextKey;
            var zeroData = this.addAllZeros(this.metaDataSize);
            var stepOut = false;
            var dataData;
            var changeString;

            for (var t = index.charAt(0); t < this.trackSize; t++) {
                for (var s = index.charAt(1); s < this.sectorSize; s++) {
                    for (var b = index.charAt(2); b < this.blockSize; b++) {
                        key = this.createNewKey(index);
                        data = sessionStorage.getItem(key);
                        nextKey = data.slice(1, 4);
                        dataData = data.slice(4, data.length);
                        if (nextKey == "---") {
                            changeString = this.convertToString(dataData);
                            value += changeString;
                            sessionStorage.setItem(key, zeroData); //replace with zeros
                            this.updateFileSystem();
                            stepOut = true;
                            break;
                        } else {
                            changeString = this.convertToString(dataData);
                            value += changeString;
                            sessionStorage.setItem(key, zeroData); //replace with zeros
                            this.updateFileSystem();
                        }
                        index = nextKey;
                    }
                    if (stepOut) {
                        break;
                    }
                }
                if (stepOut) {
                    break;
                }
            }
            if (stepOut) {
                return value;
            }
        };
        return FileSystemDeviceDriver;
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
