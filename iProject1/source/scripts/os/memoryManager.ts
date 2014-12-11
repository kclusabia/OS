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
                return memory.readMem(parseInt(index + process.getProcessBase()));
        }

        public loadMemory(data1, base) {
            memory.loadProgram(data1, base);
        }

        public loadWithoutSpaces(data1, base) {
            memory.loadWithoutSpaces(data1, base);
        }

        // Stores the data into the specified address, denoted by the index.
        public storeData(index, data) {
               return memory.storeData(parseInt(index+process.getProcessBase()), data);
        }

        public updateMemory() {
            return memory.updateMem();
        }

        public clearMemory() {
            memory.clearMem();
        }

    }
}