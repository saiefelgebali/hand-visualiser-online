"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const shortid_1 = __importDefault(require("shortid"));
const debug_1 = require("debug");
const debugLog = debug_1.debug("app:connection");
class Connection {
    constructor(socket) {
        this.username = "";
        this.socket = socket;
        this._id = shortid_1.default.generate();
        debugLog("created a new connection  with id", this._id);
    }
    get id() {
        return this._id;
    }
    emit(data) {
        debugLog(`emitting to connection ${this._id}: %O`, data);
        this.socket.send(JSON.stringify(data));
    }
}
exports.Connection = Connection;
