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
           //alert("read at: "+ parseInt(process.getBase()+index)+", OP: "+_CPU.IR);
            return memory.readMem(parseInt(index+process.getBase()));
        }

        public loadMemory(data1, base) {
            memory.loadProgram(data1, base);
        }

        // Stores the data into the specified address, denoted by the index.
        public storeData(index, data) {
          // alert("store at: "+parseInt(process.getBase()+index)+", str: "+data);
            memory.storeData(parseInt(index+process.getBase()), data);
        }

        public updateMemory() {
            return memory.updateMem();
        }

        public clearMemory() {
            memory.clearMem();
        }

    }
}