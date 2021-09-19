"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const debug_1 = require("debug");
const arduino_1 = require("./arduino");
const debugLog = debug_1.debug("app:server");
const port = parseInt(process.env.PORT) || 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = express_1.default();
        this.server = new http_1.default.Server(app);
        // this.socketServer = new WebSocketServer(this.server);
        arduino_1.arduinoServer(this.server);
        // use client
        app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "dist")));
        // route all requests to client
        app.use((req, res) => {
            res.sendFile(path_1.default.join(__dirname, "..", "..", "dist", "index.html"));
        });
        // use server to serve client if in production environment
        debugLog(`using node environmment ${process.env.NODE_ENV}`);
    }
    start() {
        // start accepting socket connections
        // this.socketServer.start();
        this.server.listen(this.port, () => {
            debugLog("server listening...");
            console.log(`Server running on port ${this.port}`);
            console.log(`http://localhost:${this.port}`);
        });
    }
}
new App(port).start();
