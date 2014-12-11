/* ------------
Globals.ts
Global CONSTANTS and _Variables.
(Global over both the OS and Hardware Simulation / Host.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME = "Infinite OS";
var APP_VERSION = "9.12";

var CPU_CLOCK_INTERVAL = 100;

var TIMER_IRQ = 0;

// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

//
// Global Variables
//
var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "arial";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var sysCall = 11;
var breakCall = 12;
var invalidOpCode = 13;
var contextSwitch = 14;
var newProcess = 15;
var murdered = 16;
var memoryBounded = 17;

// Creating the memory table
var _MemoryArray = null;
var _MemorySize = 768;
var memory;
var memoryMngr;

// Creating the pcb block.
var pcb;
var process;

// Creating the queues.
var readyQueue;
var residentQueue = null;
var garbageQueue = null;

var quantum = 6;
var clockCycle = 0;
var scheduler;
var schedulerType;

var fileSystem;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
