/**
 * Created by kara2 on 11/16/14.
 */
module TSOS {
    export class FileSystemDeviceDriver {
        public trackSize:number = 4;
        public sectorSize:number = 8;
        public blockSize:number = 8;
        public metaDataSize:number = 64;

        constructor() {
        }

        public printData():string {
            var dataFile = "";
            for (var bytes = 0; bytes < this.metaDataSize; bytes++) {
                dataFile += "0";
            }
            return dataFile;
        }

        public createMBR() {
            var mbr = this.createKey(0, 0, 0);
            var str = "Shit";
            var mbrData = "";
            mbrData = "1---" + this.addZeros(this.convertToHex(str), (this.metaDataSize - 4));
            localStorage.setItem(mbr, mbrData);
            this.updateFileSystem();
        }

        public format() {
            this.createFileSystem();
            this.createMBR();
            _StdOut.putText("Formatting...done!");
        }

        public createFileSystem() {
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
        }

        public updateFileSystem() {
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
        }

        public createKey(t, s, b) {
            return String(t) + String(s) + String(b);
        }

        /**
         * Gets the free directory block to create files in disk.
         * @returns {string}
         */
        public getAvailMetaDir():string {
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
        }

        /**
         * Gets the free data block, so contents can be written in.
         * @returns {string}
         */
        public getAvailMetaData():string {
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
        }

        public create(filename1:string) {
            var filenames: string [] = new Array();
            var metaKey = this.getAvailMetaDir();
            var metaIndex = this.getAvailMetaData();

            if(metaKey == "077") {
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
            var pad = this.addZeros("1" + metaIndex + filename, this.metaDataSize)
            localStorage.setItem(metaKey, pad);
            this.updateFileSystem();
            _StdOut.putText("Created the file called: " + this.convertToString(filename));

            /////
        }

        public write(file, contents) {
            var t = 0;
            var readKey = "";
            var paddedFN;
            var paddedContents;
            var firstBlock = "";
            var remString= "";

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = localStorage.getItem(newKey);
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
//            if(contentsInHex.length > this.metaDataSize-4) {
//
//                // get the first set of string that can fit in first avail data block.
//                firstBlock = contentsInHex.substring(0, (this.metaDataSize-4));
//
//            }
            paddedContents = this.addZeros(contentsInHex, (this.metaDataSize - 4));
            localStorage.setItem(readKey, "1---" + paddedContents);
            _StdOut.putText("Contents were written on the file.");
            this.updateFileSystem();
        }

        public read(file:string) {
            var t = 0;
            var tData = 1;
            var readKey = "";
            var paddedFN;
            var contents = "";

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    // goes through the directory
                    var newKey = this.createKey(t, s, b);
                    var metadata = localStorage.getItem(newKey);

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
                    var metadata1 = localStorage.getItem(newKey1);
                    var metaindex1 = metadata1.substring(0, 1);         // 1 if in use
                    if (metaindex1 == "1" && (readKey == newKey1)) {
                        contents = metadata1.substring(4, this.metaDataSize);
                        var contents1 = this.convertToString(contents);
                    }
                }
            }
            this.updateFileSystem();
            _StdOut.putText("File contains: " + contents1);
        }

        public delete(file:string) {
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
                    var metadata = localStorage.getItem(newKey);

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
                    var metadata1 = localStorage.getItem(newKey1);
                    var metaindex1 = metadata1.substring(0, 1);         // 1 if in use
                    if (metaindex1 == "1" && (readKey == newKey1)) {
                        localStorage.setItem(newKey1, "0000" + this.addZeros(str, this.metaDataSize-4));
                        _StdOut.putText("File was deleted successfully!");
                    }
                  }
                }
            this.updateFileSystem();
        }

        public filesOnDisk() {
            var t = 0;
            var files: string [] = new Array();

            for (var s = 0; s < this.sectorSize; s++) {
                for (var b = 1; b < this.blockSize; b++) {
                    var newKey = this.createKey(t, s, b);
                    var metadata = localStorage.getItem(newKey);
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
            for(var i=0; i<files.length; i++) {
                _StdOut.putText("File "+ [i] + ": " + files[i]);
                _Console.advanceLine();
            }
            this.updateFileSystem();
        }


        public convertToHex(stringName):string {
            var str:string = "";
            for(var i=0; i<stringName.length; i++) {
                str += stringName.charCodeAt(i).toString(16);
            }
            return str;
        }

        public convertToString(hexValue:string):string {
            var hex:string = "";
            for(var i=0; i<hexValue.length; i++) {
                var a = hexValue.charAt(i);
                var b = hexValue.charAt(i+1);
                hex += String.fromCharCode(parseInt((a+b),16)).toString();
                i++;
            }
            return hex;
        }

        public addZeros(name:string, length:number) {
            var str = "";
            if(name.length < length) {
                var len = name.length;
                for(var i=len; i<length; i++) {
                    str +=   "0";
                }
            }
            name +=str;
            return name ;
        }

        }

    }