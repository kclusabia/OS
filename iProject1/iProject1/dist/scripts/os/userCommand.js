var TSOS;
(function (TSOS) {
    var UserCommand = (function () {
        function UserCommand(command, args, currentFont, currentFontSize, currentXPosition, currentYPosition, buffer) {
            if (typeof command === "undefined") { command = ""; }
            if (typeof args === "undefined") { args = []; }
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            this.command = command;
            this.args = args;
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        return UserCommand;
    })();
    TSOS.UserCommand = UserCommand;
})(TSOS || (TSOS = {}));
