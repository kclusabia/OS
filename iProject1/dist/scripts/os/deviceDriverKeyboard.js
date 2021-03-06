///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((((keyCode >= 48) && (keyCode <= 57)) && !isShifted) || (keyCode == 32) || (keyCode == 13)) {
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
                    if (keyCode == 55)
                        chr = "&";
                    if (keyCode == 56)
                        chr = "*";
                    if (keyCode == 57)
                        chr = "(";
                }
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode >= 186 && keyCode <= 222) {
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
                } else {
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
            } else if (((keyCode == 38) || (keyCode == 40) || (keyCode == 9)) && !isShifted) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else if (keyCode == 8) {
                var char = _Console.buffer.substring(_Console.buffer.length - 1, _Console.buffer.length);
                if (char.length > 0)
                    _Console.toBackspace(char);
            } else if (!isShifted)
                _OsShell.shellError();
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
