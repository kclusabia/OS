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
        /**
        * Implementing it like the device driver
        */
        FileSystemDeviceDriver.prototype.aa = function () {
            this.trackSize = 4;
            this.sectorSize = 8;
            this.blockSize = 8;
            this.metaDataSize = 64;
            this.dataSize = 60;
            this.isFormatted = false;
        };

        FileSystemDeviceDriver.prototype.bb = function () {
        };

        FileSystemDeviceDriver.prototype.toPrint = function () {
            var zeros = "";
            for (var i = 0; i < this.metaDataSize; i++) {
                zeros += "0";
            }
            return zeros;
        };

        FileSystemDeviceDriver.prototype.createMBR = function () {
            var mbr = this.createKey(0, 0, 0);
            var str = "Infinite OS";
            var mbrData = "";
            mbrData = "1---" + this.addZeros(this.convertToHex(str), (this.metaDataSize - 4));
            sessionStorage.setItem(mbr, mbrData);
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.printMBR = function () {
            var mbr = this.createKey(0, 0, 0);
            var str = "Infinite OS";
            var mbrData = "1---" + this.addZeros(this.convertToHex(str), (this.metaDataSize - 4));
            _StdOut.putText(mbrData);
            alert(mbrData);
        };

        // Also checks if the file system was formatted or not.
        FileSystemDeviceDriver.prototype.format = function () {
            this.createFileSystem();
            this.createMBR();
            _StdOut.putText("Formatting...done!");
            this.isFormatted = true;
        };

        FileSystemDeviceDriver.prototype.createFileSystem = function () {
            var fileSystemTable = "<table>";
            for (var t = 0; t < this.trackSize; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);

                        var _metaData = this.toPrint();
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

        // Checks if the file system was formatted or not
        FileSystemDeviceDriver.prototype.isFormatted = function () {
            return this.isFormatted;
        };

        FileSystemDeviceDriver.prototype.create = function (filename) {
            var hex = this.convertToHex(filename);
            var pad = this.addZeros(hex, this.dataSize);
            var metaKey = this.getAvailMetaDir(pad);
            var zero = this.addAllZeros(this.dataSize);
            if (metaKey == "-1") {
                _StdOut.putText("File name already exist: " + filename);
                return;
            }
            var metaIndex = this.getAvailMetaData();
            sessionStorage.setItem(metaKey, "1" + metaIndex + pad); //create the file with the address of its contents
            sessionStorage.setItem(metaIndex, "1---" + zero); //no more chaining of contents
            this.updateFileSystem();
            var processFile = "processfile";
            var hidden = filename.slice(0, 11);
            if (hidden != processFile) {
                _StdOut.putText("Created the file called: " + filename);
            }
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.createNewKey = function (key) {
            var t = key.charAt(0);
            var s = key.charAt(1);
            var b = key.charAt(2);
            return this.createKey(t, s, b);
        };

        /**
        * Cannot have a duplicated filename.
        * @param filename
        * @returns {string}
        */
        //TODO
        FileSystemDeviceDriver.prototype.getDuplicate = function (filename) {
            var t = 0;
            var key;
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    key = this.createKey(t, s, b);
                    var data = sessionStorage.getItem(key);
                    var meta = data.slice(0, 1);
                    var hexData = data.slice(4, this.metaDataSize);
                    if ((filename == hexData) && (meta == "1")) {
                        //found duplicate and in use...
                        return key;
                    }
                }
            }
            return "-1";
        };

        FileSystemDeviceDriver.prototype.write = function (file, contents) {
            var fileInHex = this.convertToHex(file.toString());
            var hexFilePadded = this.addZeros(fileInHex, this.dataSize);
            var key = this.getDuplicate(hexFilePadded);

            if (key == "-1") {
                _StdOut.putText("File cannot be found.");
                return;
            }
            var data = sessionStorage.getItem(key);
            var indexDir = data.slice(1, 4);
            var len = contents.length;
            var dataInHex = this.convertToHex(contents.toString());
            var len1 = dataInHex.length;
            if (dataInHex.length > (this.dataSize)) {
                this.putInMoreBlocks(indexDir, dataInHex);
                this.updateFileSystem();
            } else {
                var paddedHex = this.addZeros(dataInHex, this.dataSize);
                sessionStorage.setItem(indexDir, "1---" + paddedHex);
                _StdOut.putText("Contents were written on file.");
                this.updateFileSystem();
            }
        };

        /**
        * If contents is > 60 bytes, they remaining contents gets put in the next block.
        * @param startKey
        * @param paddedContents
        */
        FileSystemDeviceDriver.prototype.putInMoreBlocks = function (startKey, paddedContents) {
            var howMany = Math.ceil((paddedContents.length) / (this.dataSize));
            var st = this.createNewKey(startKey);
            var totalAddresses = this.getTotalAddresses(st, (howMany - 1));
            var first = 0;
            var last = this.dataSize;
            var data = "";
            for (var i = 0; i < totalAddresses.length; i++) {
                data = paddedContents.slice(first, last);
                var key = this.createNewKey(totalAddresses[i]);
                if (i + 1 < totalAddresses.length) {
                    var nextKey = this.createNewKey(totalAddresses[i + 1]);
                    sessionStorage.setItem(key, "1" + nextKey + data);
                    this.updateFileSystem();
                } else {
                    var pad = this.addZeros(data, this.dataSize);
                    sessionStorage.setItem(key, "1---" + pad);
                    this.updateFileSystem();
                    break;
                }
                if (last == paddedContents.length) {
                    break;
                }
                if ((last + this.dataSize) > (paddedContents.length)) {
                    first = last;
                    last = (paddedContents.length);
                } else {
                    first = last;
                    last = (last + this.dataSize);
                }
            }
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
                        if ((key == "377") && (addressArray.length < (end))) {
                            _StdOut.putText("File System is full.");
                            return;
                        }
                        if (meta == "0") {
                            addressArray.push(key);
                            if (addressArray.length == (end)) {
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

        FileSystemDeviceDriver.prototype.getFileDir = function (filename) {
            for (var t = 0; t < 1; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = sessionStorage.getItem(key);
                        var meta = metadata.slice(0, 1);
                        var nextMeta = metadata.slice(1, 4);
                        var data = metadata.slice(4, metadata.length);
                        if ((filename == data) && meta == "1") {
                            return nextMeta;
                        }
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.read = function (file) {
            var filename = this.convertToHex(file.toString());
            var padName = this.addZeros(filename, this.dataSize);
            var wholeData = this.getFileDir(padName);

            if (wholeData == "-1") {
                _StdOut.putText("File cannot be found");
                return;
            }
            if (wholeData == "---") {
                // If there is no chaining, meaning contents is <= 60 bytes.
                var a = sessionStorage.getItem(wholeData);
                _StdOut.putText(this.convertToString(a.slice(4, a.length).toString()));
            } else {
                // If contents is > 60 bytes
                this.indexWithContents(wholeData);
            }
            this.updateFileSystem();
        };

        /**
        * Gets all the address where the contents are written
        * @param index
        */
        FileSystemDeviceDriver.prototype.indexWithContents = function (index) {
            var str = "";
            var data1;
            var stringData;
            for (var t = index.charAt(0); t < this.trackSize; t++) {
                for (var s = index.charAt(1); s < this.sectorSize; s++) {
                    for (var b = index.charAt(2); b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var data = sessionStorage.getItem(key);
                        var DirKey = data.slice(1, 4);
                        if (DirKey == "---") {
                            data1 = data.slice(4, data.length);
                            stringData = this.convertToString(data1.toString());
                            _StdOut.putText(stringData);
                            _Console.advanceLine();
                            return;
                        } else {
                            data1 = data.slice(4, data.length);
                            stringData = this.convertToString(data1.toString());
                            _StdOut.putText(stringData);
                        }
                        index = DirKey;
                    }
                }
            }
        };

        FileSystemDeviceDriver.prototype.deleteFile = function (file) {
            var t = 0;
            var empty = this.addAllZeros(this.metaDataSize);
            var contents = this.convertToHex(file);
            var paddedFN = this.addZeros(contents, this.dataSize);
            var readKey = this.getNextAddress(paddedFN);
            if (readKey != "-1") {
                //found the file-name now delete its contents.
                var filecontents = sessionStorage.getItem(readKey);
                var meta = filecontents.slice(1, 4);
                if (meta == "---") {
                    _StdOut.putText("Deleted file: " + file);
                } else {
                    this.deleteAllContents(readKey, empty);
                }
                sessionStorage.setItem(readKey, empty);
            } else {
                _StdOut.putText("Cannot find the file: " + file);
            }
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.deleteAllContents = function (startKey, empty) {
            for (var t = startKey.charAt(0); t < this.trackSize; t++) {
                for (var s = startKey.charAt(1); s < this.sectorSize; s++) {
                    for (var b = startKey.charAt(2); b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var data = sessionStorage.getItem(key);
                        var DirKey = data.slice(1, 4);
                        if (DirKey == "---") {
                            sessionStorage.setItem(key, empty);
                            return;
                        } else {
                            sessionStorage.setItem(key, empty);
                        }
                        startKey = DirKey;
                    }
                }
            }
        };

        // Called for ls command
        FileSystemDeviceDriver.prototype.filesOnDisk = function () {
            var t = 0;
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = sessionStorage.getItem(newKey);
                    var metaindex = metadata.slice(0, 1);
                    var fn = metadata.slice(4, metadata.length);
                    var stringFilename = this.convertToString(fn);
                    if (metaindex == "1") {
                        _StdOut.putText(newKey + ": " + stringFilename);
                        _Console.advanceLine();
                    }
                }
            }
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

        /**
        * Rolls the process out of memory
        * @param program
        * @param contents
        */
        FileSystemDeviceDriver.prototype.rollOut = function (program, contents) {
            var newFile = "processfile" + program.getPID();
            this.create(newFile);
            this.write(newFile, contents);
        };

        // Chaining occurs
        FileSystemDeviceDriver.prototype.getNextAddress = function (filename) {
            var key;
            var t = 0;
            var allZero = this.addAllZeros(this.metaDataSize);
            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    key = this.createKey(t, s, b);
                    var metaData = sessionStorage.getItem(key);
                    var notAvail = metaData.slice(0, 1);
                    var addr = metaData.slice(1, 4);
                    var hexData = metaData.slice(4, metaData.length);
                    if ((filename == hexData) && (notAvail == "1")) {
                        sessionStorage.setItem(key, allZero);
                        return addr;
                    }
                }
            }
            return "-1";
        };

        FileSystemDeviceDriver.prototype.loadFromDisk = function (processOnDisk, newBase) {
            var zeroData = this.addAllZeros(this.metaDataSize);
            var filename = "processfile" + processOnDisk.getPID();
            var fileHex = this.convertToHex(filename.toString());
            var padFile = this.addZeros(fileHex, this.dataSize);
            var dataIndex = this.getNextAddress(padFile);
            var data = this.getProgramContents(dataIndex);

            sessionStorage.setItem(dataIndex, zeroData);
            processOnDisk.setProcessBase(newBase);
            processOnDisk.setProcessLimit((newBase + 255));
            TSOS.Shell.updateRes();
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
            var toLeave = false;
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
                            toLeave = true;
                            break;
                        } else {
                            changeString = this.convertToString(dataData);
                            value += changeString;
                            sessionStorage.setItem(key, zeroData);
                            this.updateFileSystem();
                        }
                        index = nextKey;
                    }
                    if (toLeave) {
                        break;
                    }
                }
                if (toLeave) {
                    break;
                }
            }
            if (toLeave) {
                return value;
            }
        };

        FileSystemDeviceDriver.prototype.rollIn = function (currentp, nextp) {
            var currentContents;
            var allData;
            var allZero = this.addAllZeros(this.metaDataSize);
            var fileOnDisk = "processfile" + currentp.getPID();
            var contentsInHex = this.convertToHex(fileOnDisk.toString());
            var paddedContents = this.addZeros(contentsInHex, this.dataSize);
            var index = this.addZeroContents(paddedContents);
            allData = this.getProgramContents(index);
            sessionStorage.setItem(index, allZero); // Going from disk to memory, so delete the file in disk
            currentp.setProcessBase(nextp.getProcessBase());
            currentp.setProcessLimit(nextp.getProcessLimit());
            currentp.setState(1);
            currentp.setLocation("memory");
            TSOS.Shell.updateRes();
            if (nextp.getState() == "terminated") {
                nextp.setLocation("black-hole");
            } else {
                fileOnDisk = "processfile" + nextp.getPID();
                currentContents = memory.getWholeBlock(nextp.getProcessBase());
                nextp.setState(2); //waiting
                nextp.setLocation("disk");
                nextp.setProcessBase(-1);
                nextp.setProcessLimit(-1);
                this.create(fileOnDisk);
                this.write(fileOnDisk, currentContents);
            }
            TSOS.Shell.updateRes();
            memoryMngr.loadWithoutSpaces(allData.toString(), currentp.getProcessBase());
            this.updateFileSystem();
        };

        FileSystemDeviceDriver.prototype.getAllContents = function (ind) {
            var key;
            var data1;
            var nextKey;
            var contentsInHex;
            var str = "";
            var data = "";
            var toLeave = false;
            var allZeros = this.addAllZeros(this.metaDataSize);
            for (var t = ind.charAt(0); t < this.trackSize; t++) {
                for (var s = ind.charAt(1); s < this.sectorSize; s++) {
                    for (var b = ind.charAt(2); b < this.blockSize; b++) {
                        key = this.createNewKey(ind);
                        data = sessionStorage.getItem(key);
                        nextKey = data.slice(1, 4);
                        data1 = data.slice(4, data.length);
                        if (nextKey == "---") {
                            contentsInHex = this.convertToString(data1);
                            str += contentsInHex;
                            sessionStorage.setItem(key, allZeros);
                            this.updateFileSystem();
                            toLeave = true;
                            break;
                        } else {
                            contentsInHex = this.convertToString(data1);
                            str += contentsInHex;
                            sessionStorage.setItem(key, allZeros);
                            this.updateFileSystem();
                        }
                        key = nextKey;
                        ind = nextKey;
                    }
                    if (toLeave) {
                        break;
                    }
                }
                if (toLeave) {
                    break;
                }
            }
            if (toLeave) {
                return str;
            }
        };

        /**
        * Used for deleting files, and changing everything to 0.
        * @param filename
        * @returns {string}
        */
        FileSystemDeviceDriver.prototype.addZeroContents = function (filename) {
            var track = 0;
            var key;
            var allZero = this.addAllZeros(this.metaDataSize);
            for (var sect = 0; sect < this.sectorSize; sect++) {
                for (var block = 0; block < this.blockSize; block++) {
                    key = this.createKey(track, sect, block);
                    var metadata1 = sessionStorage.getItem(key);
                    var ifInUse = metadata1.slice(0, 1);
                    var meta = metadata1.slice(1, 4);
                    var dataInHex = metadata1.slice(4, metadata1.length);
                    if ((filename == dataInHex) && (ifInUse == "1")) {
                        sessionStorage.setItem(key, allZero);
                        return meta;
                    }
                }
            }
            return "-1";
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
        return FileSystemDeviceDriver;
    })(TSOS.DeviceDriver);
    TSOS.FileSystemDeviceDriver = FileSystemDeviceDriver;
})(TSOS || (TSOS = {}));
