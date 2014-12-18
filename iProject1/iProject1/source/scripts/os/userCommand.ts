module TSOS {
    export class UserCommand {
        constructor(public command = "",
                    public args = [],
                    public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {

        }
    }
}
