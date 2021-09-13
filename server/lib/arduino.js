"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arduinoServer = void 0;
// example article: https://medium.com/@pkl9231/serial-communication-between-node-js-and-arduno-read-and-write-data-2a712e07d337
const serialport_1 = __importDefault(require("serialport"));
const parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
const ws_1 = require("ws");
/**
 * You will have to find the name of the serial port in your computer.
 * An easy way to do this is from Arduino IDE, tools > port menu.
 */
const portName = "ttyACM0";
const port = new serialport_1.default(`/dev/${portName}`, { baudRate: 9600 });
const parser = port.pipe(new parser_readline_1.default({ delimiter: "\n" }));
const fingerMap = [
    "thumb",
    "index",
    "middle",
    "ring",
    "pinky",
];
function arduinoServer(server) {
    const wss = new ws_1.Server({ server });
    wss.on("connection", (socket) => {
        console.log("CONNECTED TO CLIENT");
        // read the port data
        port.on("open", () => {
            console.log("Serial port open");
        });
        parser.on("data", (data) => {
            const [finger, value] = data.split(">>");
            const handPosition = {
                type: "handPosition",
                hand: {
                    [fingerMap[parseInt(finger)]]: parseInt(value),
                },
            };
            socket.send(handPosition);
        });
    });
}
exports.arduinoServer = arduinoServer;
