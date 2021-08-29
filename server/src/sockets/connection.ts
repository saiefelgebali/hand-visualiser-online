import WebSocket from "ws";
import { Room } from "./rooms";
import shortid from "shortid";
import { debug } from "debug";

const debugLog = debug("app:connection");

export class Connection {
	private _id: string;
	public get id() {
		return this._id;
	}

	private socket: WebSocket;
	public username: string = "";
	public room?: Room;

	public constructor(socket: WebSocket) {
		this.socket = socket;
		this._id = shortid.generate();
		debugLog("created a new connection  with id", this._id);
	}

	public emit(data: Object) {
		debugLog(`emitting to connection ${this._id}: %O`, data);
		this.socket.send(JSON.stringify(data));
	}
}
