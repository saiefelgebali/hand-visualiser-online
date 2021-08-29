import http from "http";
import { Server } from "ws";
import { Connection } from "./connection";
import { Rooms } from "./rooms";
import {
	SocketData,
	ClientJoinRoom,
	ServerConnection,
	ClientUserJoined,
	ClientUserLeft,
	ServerChatMessage,
	ClientChatMessage,
	ServerHandPosition,
	ClientHandPosition,
} from "../interfaces/socket.requests.interface";

import { debug } from "debug";

const debugLog = debug("app:sockets");

export class WebSocketServer {
	private wss: Server;
	private rooms = new Rooms();
	private connections: Connection[] = [];

	/**
	 * Handle WebSocket connections
	 */
	public constructor(server: http.Server) {
		debugLog("starting socket server");
		this.wss = new Server({ server });
	}

	public start = () => {
		debugLog("handling socket connections");
		// Handle new connections
		this.wss.on("connection", (socket) => {
			const connection = new Connection(socket);

			// Send messages to message handler
			socket.on("message", (message) => {
				const data = JSON.parse(message.toString()) as SocketData;
				this.handleMessage(connection, data);
			});

			// Handle closing connection
			socket.on("close", () => this.handleCloseConnection(connection));
		});
	};

	private handleMessage = (connection: Connection, message: SocketData) => {
		debugLog(
			`received message from connection ${connection.id}: %O`,
			message
		);

		switch (message.type) {
			case "connect":
				this.handleServerConnection(
					connection,
					message as ServerConnection
				);
				break;

			case "chatMessage":
				this.handleChatMessage(
					connection,
					message as ServerChatMessage
				);
				break;

			case "handPosition":
				this.handleHandPositon(
					connection,
					message as ServerHandPosition
				);

			default:
				break;
		}
	};

	private handleServerConnection = (
		connection: Connection,
		data: ServerConnection
	) => {
		// give connection username
		connection.username = data.username;

		// add user to room
		data.roomId = data.roomId.toUpperCase(); // ensure room id is in all caps
		const room =
			this.rooms.getRoom(data.roomId) ||
			this.rooms.createRoom(data.roomId, connection);
		room.addConnection(connection);
		connection.room = room;

		// return room info to client
		const joinRoomData: ClientJoinRoom = {
			type: "joinRoom",
			client: {
				userId: connection.id,
				username: connection.username,
			},
			room: {
				roomId: room.roomId,
				users: room.getUsers(),
				hostname: room.hostname,
			},
		};
		connection.emit(joinRoomData);

		// inform other room users that a new client has joined
		const userJoinedData: ClientUserJoined = {
			type: "userJoined",
			user: {
				userId: connection.id,
				username: data.username,
			},
		};
		room.emit(userJoinedData, connection);
	};

	private handleChatMessage = (
		connection: Connection,
		data: ServerChatMessage
	) => {
		const chatMessageData: ClientChatMessage = {
			type: "chatMessage",
			user: { userId: connection.id, username: connection.username },
			message: data.message,
		};
		connection.room.emit(chatMessageData);
	};

	private handleHandPositon = (
		connection: Connection,
		data: ServerHandPosition
	) => {
		const handPositionData: ClientHandPosition = data;
		connection.room.emit(handPositionData, connection);
	};

	private handleCloseConnection = (connection: Connection) => {
		this.connections = this.connections.filter(
			(conn) => conn !== connection
		);

		if (connection.room) {
			// remove connection from room
			const room = connection.room;
			room.removeConnection(connection);

			// inform other room users
			const userLeftData: ClientUserLeft = {
				type: "userLeft",
				user: {
					userId: connection.id,
					username: connection.username,
				},
				room: {
					hostname: room.hostname,
				},
			};
			room.emit(userLeftData, connection);

			// remove room from cache if no users
			if (connection.room.connectionsLength === 0) {
				this.rooms.removeRoom(room);
			}
		}
	};
}
