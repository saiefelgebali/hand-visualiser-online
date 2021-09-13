// example article: https://medium.com/@pkl9231/serial-communication-between-node-js-and-arduno-read-and-write-data-2a712e07d337
import SerialPort from "serialport";
import Readline from "@serialport/parser-readline";
import { Server } from "ws";
import http from "http";
import {
	ClientHandPosition,
	HandPosition,
} from "./interfaces/socket.requests.interface";

/**
 * You will have to find the name of the serial port in your computer.
 * An easy way to do this is from Arduino IDE, tools > port menu.
 */
const portName = "ttyACM1";
const port = new SerialPort(`/dev/${portName}`, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: "\n" }));

const fingerMap: (keyof HandPosition)[] = [
	"thumb",
	"index",
	"middle",
	"ring",
	"pinky",
];

export function arduinoServer(server: http.Server) {
	const wss = new Server({ server });

	wss.on("connection", (socket) => {
		// read the port data
		port.on("open", () => {
			console.log("Serial port open");
		});

		parser.on("data", (data) => {
			console.log(data);
			const [finger, value] = data.split(">>");

			if (!parseInt(finger)) return;
			if (!parseFloat(value)) return;

			const amount = (1 - parseFloat(value)) * 100;

			const handPosition: ClientHandPosition = {
				type: "handPosition",
				hand: {
					[fingerMap[parseInt(finger) - 1]]: amount,
				},
			};

			socket.send(JSON.stringify(handPosition));
		});
	});
}
