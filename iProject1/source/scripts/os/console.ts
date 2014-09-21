///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public commandsIndex = 0,
                    public commandsList = [""]) {

        }

        public init():void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen():void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY():void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput():void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.commandsList.push(this.buffer);    // adds the buffer into the array of commands
                    this.commandsIndex = this.commandsList.length;  // sets the new index
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr == String.fromCharCode(38) || chr == String.fromCharCode(40)) {
                    this.previousCommands(chr);
                }

                else if (chr == String.fromCharCode(9)) {
                    this.commandFound();
                }

                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public toDeleteLine():void {
            var y = this.currentYPosition - _DefaultFontSize;
            _DrawingContext.clearRect(0, y, this.currentXPosition, y);
            this.buffer = "";
            this.currentXPosition = 0;
        }

        // method for backspace.
        public toBackspace(char):void {
            var x = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, char);
            var y = this.currentYPosition - _DefaultFontSize - 0.9;

            this.buffer = this.buffer.substring(0, this.buffer.length - 1);
            _DrawingContext.clearRect(x, y, this.currentXPosition, this.currentYPosition + 20);
            this.currentXPosition = this.currentXPosition - _DrawingContext.measureText(this.currentFont, this.currentFontSize, char);
        }

        // method for the BSOD message.
        public ifError():void {
            this.clearScreen();
            _DrawingContext.fillStyle = "blue";
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            _DrawingContext.drawText("sans", 45, 145, 150, "Oh no!");
            _DrawingContext.drawText("sans", 30, 45, 200, "Error #007 occurred!");
            _DrawingContext.drawText("sans", 45, 195, 250, "o.o");
        }

        public previousCommands(chr):void {
            if (chr == String.fromCharCode(38) && this.commandsIndex >= 1) {   // up arrow and more than 1 command in array
                this.commandsIndex--;
                this.toDeleteLine();
                _OsShell.putPrompt();
                this.buffer = (this.commandsList[this.commandsIndex]);
                this.putText(this.buffer);

                if (this.commandsIndex == 0) {
                    this.commandsIndex = this.commandsList.length;
                    this.commandsIndex--;
                    this.toDeleteLine();
                    _OsShell.putPrompt();
                    this.buffer = (this.commandsList[this.commandsIndex]);
                    this.putText(this.buffer);
                }
            }

            else if (chr == String.fromCharCode(40) && this.commandsIndex <= this.commandsList.length) {
                this.commandsIndex++;
                this.toDeleteLine();
                _OsShell.putPrompt();
                this.buffer = (this.commandsList[this.commandsIndex]);
                this.putText(this.buffer);

                if (this.commandsIndex == this.commandsList.length-1) {
                    this.commandsIndex = -1;
                    this.commandsIndex++;
                    this.toDeleteLine();
                    _OsShell.putPrompt();
                    this.buffer = (this.commandsList[this.commandsIndex]);
                    //this.buffer = (this.commandsList[this.commandsIndex]);
                    this.putText(this.buffer);
                }
            }
        }

        // auto-completion for commands
        public commandFound():void {
            var setOfCommands = [""];
            var sameCommand = "";
        }

        public putText(text):void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.

            var c = 0;
            while (c != text.length) {

                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text[c]);

                var charSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text[c]);
                var offset = this.currentXPosition + charSize;

                if (offset > (_Canvas.width - 35)) {
                    this.advanceLine();
                } else {
                    this.currentXPosition = offset;
                }
                c++;

//                var nextY = this.currentYPosition + charSize;
//                if (nextY > (_Canvas.height - 35)) {
//                    this.scrollBar();
//                } else {
//                    this.currentYPosition = nextY;
//                }
//                c++;
            }

//
//            if (text !== "") {
//                // Draw the text at the current X and Y coordinates.
//                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
//                // Move the current X position.
//                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
//                this.currentXPosition = this.currentXPosition + offset;
//            }
        }

        public advanceLine():void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */

            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            if (this.currentYPosition >= _Canvas.height) {
                this.showScrollbar();
            }
        }

            public showScrollbar():void {
            var img = _DrawingContext.getImageData(0, this.currentFontSize + 10, _Canvas.width, _Canvas.height);
            _DrawingContext.putImageData(img, 0, 0);
            this.currentYPosition = _Canvas.height - this.currentFontSize;
        }


    }
}
