/**
 * Created by kara2 on 10/8/14.
 */
module TSOS {

    export class MemoryManager {

        constructor() {
            memory = new Memory();
            memory.newTable();
        }

        public readMemory(index) {
            return memory.readMem(index);
        }

        public storeData(index, data) {
            Memory.storeData(index, data);
        }
    }
}