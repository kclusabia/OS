///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);

            } else if ( (((keyCode >= 48) && (keyCode <= 57)) && !isShifted) ||   // digits
                (keyCode == 32) ||                       // space
                (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);

                // shifted punctuations with digits.
            } else if ((keyCode >= 48) && (keyCode <= 57) && isShifted) {
                {
                    if (keyCode == 48)
                        chr = ")";
                    if (keyCode == 49)
                        chr = "!";
                    if (keyCode == 50)
                        chr = "@";
                    if (keyCode == 51)
                        chr = "#";
                    if (keyCode == 52)
                        chr = "$";
                    if (keyCode == 53)
                        chr = "%";
                    if (keyCode == 54)
                        chr = "^";
                    if (keyCode == 55)      //TODO shift + 7 is acting as arrow up
                        chr = "&";
                    if (keyCode == 56)
                        chr = "*";
                    if (keyCode == 57)     //TODO shift + 9 is acting as arrow down
                        chr = "(";
                }
                _KernelInputQueue.enqueue(chr);
            }

            // other punctuations and shifted.
            else if (keyCode >= 186 && keyCode <= 222)  {
                  if (isShifted) {
                    if (keyCode == 186)
                        chr = ":";
                    if (keyCode == 187)
                        chr = "+";
                    if (keyCode == 188)
                        chr = "<";
                    if (keyCode == 189)
                        chr = "_";
                    if (keyCode == 190)
                        chr = ">";
                    if (keyCode == 191)
                        chr = "?";
                    if (keyCode == 192)
                        chr = "~";
                    if (keyCode == 219)
                        chr = "{";
                    if (keyCode == 220)
                        chr = "|";
                    if (keyCode == 221)
                        chr = "}";
                    if (keyCode == 222)
                        chr = "\"";
                }
                  // for some reason, the function String.fromCharCode() is not working, so had to hard-code it.
                  // punctuations that are not shifted.
                  else {
                      if (keyCode == 186)
                          chr = ";";
                      if (keyCode == 187)
                          chr = "=";
                      if (keyCode == 188)
                          chr = ",";
                      if (keyCode == 189)
                          chr = "-";
                      if (keyCode == 190)
                          chr = ".";
                      if (keyCode == 191)
                          chr = "/";
                      if (keyCode == 192)
                          chr = "`";
                      if (keyCode == 219)
                          chr = "[";
                      if (keyCode == 220)
                          chr = "\\";
                      if (keyCode == 221)
                          chr = "]";
                      if (keyCode == 222)
                          chr = "'";
                }
                _KernelInputQueue.enqueue(chr);
            }

            // arrow up key, arrow down key and tab key
            else if ( ((keyCode == 38) || (keyCode == 40) || (keyCode == 9)) && !isShifted ) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }

            // backspace
            else if (keyCode == 8) {
                var char = _Console.buffer.substring(_Console.buffer.length - 1, _Console.buffer.length);
                if (char.length > 0)
                    _Console.toBackspace(char);
            }
            else
            _OsShell.shellError();

        }
    }
}



