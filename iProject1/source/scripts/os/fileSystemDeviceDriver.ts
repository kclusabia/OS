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
            for(var bytes = 0; bytes < this.metaDataSize; bytes++) {
                dataFile  += "0";
    }
    return dataFile;
    }

        public createMBR() {
            var mbr = this.createKey(0,0,0);
            localStorage.setItem(mbr,"1---mbr");
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
                for(var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        // TSB block acts as the key.
                        var key = this.createKey(t,s,b);

                        var _metaData = this.printData();
                        localStorage.setItem(key, _metaData);

                        var metaData = localStorage.getItem(key);
                        var meta = metaData.substring(0,4);
                        var data = metaData.substring(4,this.metaDataSize);
                        fileSystemTable += "<tr><td>" + t + s  + b;

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
                for(var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        // TSB block acts as the key.
                        var key = this.createKey(t,s,b);

                        var metaData = localStorage.getItem(key);
                        var meta = metaData.substring(0,4);
                        var data = metaData.substring(4,this.metaDataSize);
                        fileSystemTable += "<tr><td>" + t + s  + b;

                        fileSystemTable += "<td>" + meta + "<td>" + data;

                        fileSystemTable += "</td></tr>";
//
                    }
                }
            }
            document.getElementById("fileSystemTable").innerHTML = fileSystemTable + "</table>";
        }

        public createKey(t,s,b) {
            return String(t) + String(s) + String(b);
        }

        public getAvailMetaDir():string {
            for (var t = 0; t < 1; t++) {
                for(var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t,s,b);
                        var metadata = localStorage.getItem(key);
                        if(metadata.substring(0,1) == 0) {
                            return key;
                        }
                    }
                }
            }
        }

        public getAvailMetaData():string {
            for (var t = 1; t < 4; t++) {
                for (var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        var key = this.createKey(t, s, b);
                        var metadata = localStorage.getItem(key);
                        if(metadata.substring(0,1) == 0) {
                            return key;
                        }
                    }
                }
            }
        }

        public create(filename1:string) {
            var metaKey = this.getAvailMetaDir();
            var metaIndex = this.getAvailMetaData();

            var filename = this.convertToHex(filename1);
            var pad = this.addZeros("1"+ metaIndex + filename, this.metaDataSize)
            localStorage.setItem(metaKey, pad);
            this.updateFileSystem();
            _StdOut.putText("Created the file called: " + this.convertToString(filename));

            /////
        }

        public write(file,contents) {


            var t = 0;
            var readKey = "";
            var pad;

            for(var s = 0; s<this.sectorSize;s++) {
                for (var b = 0; b < this.blockSize; b++) {
                    var newKey = this.createKey(t,s,b);
                    var metadata = localStorage.getItem(newKey);
                    var haha = metadata.slice(0,1);
                    var f = metadata.slice(4,this.metaDataSize);
                    var hexString = this.convertToHex(file);
                     pad = this.addZeros(hexString, (this.metaDataSize-4));
                    if(haha == "1" &&  (pad == f)){
                        readKey = metadata.slice(1, 4);
                        break;
                    }
                }
            }

            localStorage.setItem(readKey,"1---"+this.addZeros(this.convertToHex(contents), (this.metaDataSize-4)));
            this.updateFileSystem();
//            var contents:string = "";
//            contents = this.convertToHex(str);
//            var dataKey = this.getAvailMetaDir();
//            localStorage.setItem(dataKey, contents);
//            this.updateFileSystem();
//            _StdOut.putText("Done writing!");
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