/**
 * Created by kara2 on 11/16/14.
 */
module TSOS {
    export class HardDriveManager {
        public trackSize:number = 4;
        public sectorSize:number = 8;
        public blockSize:number = 8;
        public mbr:number = 5;
        public bytesPerBlock:number = 60;

        constructor() {
            this.createFileSystem();
        }

        public createFileSystem() {
            var fileSystemTable = "<table>";
            for (var t = 0; t < this.trackSize; t++) {
                for(var s = 0; s < this.sectorSize; s++) {
                    for (var b = 0; b < this.blockSize; b++) {
                        fileSystemTable += "<tr><td>" + t + s  + b + " ";

                        for(var m = 0; m < this.mbr; m++) {
                           // fileSystemTable += "<td>";
                            fileSystemTable += "<td>" + 0;
                        }

                        for(var bytes = 1; bytes < this.bytesPerBlock; bytes++) {
                            fileSystemTable += bytes;
                        }
                        fileSystemTable += "</td></tr>";
//
                    }
                }
            }
            document.getElementById("fileSystemTable").innerHTML = fileSystemTable + "</table>";
          }
        }

    }