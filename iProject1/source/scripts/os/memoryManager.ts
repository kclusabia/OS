/**
 * Created by kara2 on 10/8/14.
 */
module TSOS {

    export class MemoryManager {

        // Creates a memory object. The memory table is also created.
        constructor() {
            memory = new Memory();
            memory.newTable();

        }

        // Reads the data from the specified address, denoted as the index.
        public readMemory(index) {
            return memory.readMem(index);
        }

        // Stores the data into the specified address, denoted by the index.
        public storeData(index, data) {
            memory.storeData(index, data);
        }

        public updateMemory() {
            return memory.updateMem();
        }

    }
}