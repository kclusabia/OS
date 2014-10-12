/**
 * Created by kara2 on 10/8/14.
 */
module TSOS {

    export class memoryManager {

        constructor() {
            memory = new Memory();
        }

        public readMemory(pc) {
            return _MemoryArray[pc];
        }
    }
}