import { User } from "../interfaces/socket.requests.interface";
import { Connection } from "./connection";
import { debug } from "debug";

const debugLog = debug("app:rooms");

export class Room {
	public roomId: string;
	private connections: Connection[] = [];
	private host: Connection;

	public get connectionsLength() {
		return this.connections.length;
	}

	public get hostname() {
		return this.host.username;
	}

	public constructor(roomId: string, host: Connection) {
		this.roomId = roomId;
		this.host = host;
		debugLog(`created a new room with id`, roomId);
	}

	public addConnection(connection: Connection) {
		debugLog(`adding connection ${connection.id} to room ${this.roomId}`);
		connection.room = this;
		this.connections.push(connection);
		debugLog(`added connection ${connection.id} to room ${this.roomId}`);
	}

	public removeConnection(connection: Connection) {
		debugLog(
			`removing connection ${connection.id} from room ${this.roomId}`
		);
		// make new host if removing current host
		if (connection === this.host) {
			this.host = this.connections[0];
		}
		// remove connection
		this.connections = this.connections.filter(
			(conn) => conn !== connection
		);
		debugLog(
			`removed connection ${connection.id} from room ${this.roomId}`
		);
	}

	// return usernames of all room users
	public getUsers() {
		// debug log number of connections in room
		const count = this.connections.length;
		const moreThanOne = count > 1;
		debugLog(
			`${count} user${moreThanOne ? "s" : ""} ${
				moreThanOne ? "are" : "is"
			} connected to room`,
			this.roomId
		);

		// return users in room
		return this.connections.map<User>((conn) => ({
			userId: conn.id,
			username: conn.username,
		}));
	}

	/**
	 * Send  data to all room connections.
	 * Exclude any connections as required
	 */
	public emit(data: Object, exclude?: Connection) {
		debugLog(`emitting data to room ${this.roomId}: %O`, data);
		this.connections.forEach((conn) => {
			if (exclude && exclude === conn) return;
			conn.emit(data);
		});
	}
}

export class Rooms {
	private rooms: Room[] = [];

	public getRoom = (roomId: string) => {
		debugLog("requested room", roomId);
		const room = this.rooms.find((room) => room.roomId === roomId);
		debugLog(
			room ? `found room ${roomId}` : `could not find room ${roomId}`
		);
		debugLog("rooms", this.rooms);
		return room;
	};

	public createRoom = (roomId: string, host: Connection) => {
		const room = new Room(roomId, host);
		this.rooms.push(room);
		return room;
	};

	public removeRoom = (room: Room) => {
		debugLog("removing room", room.roomId);
		debugLog("rooms", this.rooms);
		this.rooms = this.rooms.filter((r) => r.roomId !== room.roomId);
		debugLog("rooms", this.rooms);
		debugLog("removed room", room.roomId);
	};
}
