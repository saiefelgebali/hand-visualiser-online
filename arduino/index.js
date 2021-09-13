// example article: https://medium.com/@pkl9231/serial-communication-between-node-js-and-arduno-read-and-write-data-2a712e07d337
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

/**
 * You will have to find the name of the serial port in your computer.
 * An easy way to do this is from Arduino IDE, tools > port menu.
 */
const portName = "ttyACM0";
const port = new SerialPort(`/dev/${portName}`, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

const socket = new WebSocket("ws://localhost:5000");

socket.on("open", (e) => {
	socket.send("hello world!");
});

// read the port data
port.on("open", () => {
	console.log("Serial port open");
});

parser.on("data", (data) => {
	const [finger, value] = data.split(">>");
	console.log(finger, value);
});
