/**
 * Created by kara2 on 11/16/14.
 */
module TSOS {
    export class HardDriveManager {
        public trackSize:number = 4;
        public sectorSize:number = 8;
        public blockSize:number = 8;
        public mbr:number = 5;
        public metaDataSize:number = 64;

        constructor() {
            this.createFileSystem();
        }

        public printData():string {
        var dataFile = "";
            for(var bytes = 0; bytes < this.metaDataSize; bytes++) {
                dataFile  += "0";
    }
    return dataFile;
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

//                        for(var m = 0; m < this.mbr; m++) {
                           // fileSystemTable += "<td>";
                            fileSystemTable += "<td>" + meta + "<td>" + data;


//                        for(var bytes = 1; bytes < this.bytesPerBlock; bytes++) {
//                            fileSystemTable += bytes;
//                        }
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
        }

    }