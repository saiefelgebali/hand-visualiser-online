import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "./sockets/sockets";
import { debug } from "debug";

const debugLog = debug("app:server");

const port = parseInt(process.env.PORT) || 3000;

class App {
	private server: http.Server;
	private port: number;
	private socketServer: WebSocketServer;

	constructor(port: number) {
		this.port = port;
		const app = express();
		this.server = new http.Server(app);
		this.socketServer = new WebSocketServer(this.server);

		// use client
		app.use(express.static(path.join(__dirname, "..", "..", "dist")));

		// route all requests to client
		app.use((req, res) => {
			res.sendFile(
				path.join(__dirname, "..", "..", "dist", "index.html")
			);
		});

		// use server to serve client if in production environment
		debugLog(`using node environmment ${process.env.NODE_ENV}`);
	}

	public start() {
		// start accepting socket connections
		this.socketServer.start();

		this.server.listen(this.port, () => {
			debugLog("server listening...");
			console.log(`Server running on port ${this.port}`);
			console.log(`http://localhost:${this.port}`);
		});
	}
}

new App(port).start();
