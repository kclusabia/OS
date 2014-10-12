/**
 * Created by kara2 on 10/8/14.
 */
module TSOS {

    export class MemoryManager {

        constructor() {
          //  memory = new Memory();
        }

        public readMemory(index) {
            return _MemoryArray[index];
        }

        public storeData(index, data) {
            _Memory.storeData(index, data);
        }
    }
}