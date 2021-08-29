import {
	ClientChatMessage,
	ClientHandPosition,
	ClientJoinRoom,
	ClientUserJoined,
	ClientUserLeft,
	HandPosition,
	ServerChatMessage,
	ServerConnection,
	ServerHandPosition,
	SocketData,
} from "./socket.requests.interface";
import {
	username,
	roomId,
	setHandPosition,
	setMessages,
	setUsers,
} from "../context/room.state";
import { SocketConnection } from "./socket.connection";
import { Message } from "../components/Panels/ChatPanel";
import { DEBUG } from "../settings";

export class SocketController {
	private socket: SocketConnection;

	constructor(socket: SocketConnection) {
		this.socket = socket;
	}

	// socket emit functions
	public sendChatMessage = (message: string) => {
		const serverChatMessage: ServerChatMessage = {
			type: "chatMessage",
			message,
		};
		this.socket.emit(serverChatMessage);
	};
	public sendHandPosition = (hand: HandPosition) => {
		const serverChatMessage: ServerHandPosition = {
			type: "handPosition",
			hand,
		};
		this.socket.emit(serverChatMessage);
	};

	// socket handlers
	onSocketOpen = () => {
		// send connect data
		const connectData: ServerConnection = {
			type: "connect",
			roomId: roomId(),
			username: username(),
		};
		this.socket.emit(connectData);
	};
	onSocketClose = () => {
		// close socket
	};

	onSocketMessage = (data: SocketData) => {
		if (DEBUG) console.log(data);
		// socket messages router
		switch (data.type) {
			case "joinRoom":
				return this.handleJoinRoom(data as ClientJoinRoom);
			case "userJoined":
				return this.handleUserJoined(data as ClientUserJoined);
			case "userLeft":
				return this.handleUserLeft(data as ClientUserLeft);
			case "chatMessage":
				return this.handleChatMessage(data as ClientChatMessage);
			case "handPosition":
				return this.handleHandPosition(data as ClientHandPosition);
		}
	};

	private handleJoinRoom = (data: ClientJoinRoom) => {
		setUsers(data.room.users);
		// show join message
		const joinMessage: Message = {
			message: "You joined the lobby!",
			info: true,
		};
		setMessages((prev) => [...prev, joinMessage]);
	};

	private handleUserJoined = (data: ClientUserJoined) => {
		setUsers((prev) => [...prev, data.user]);
		// show user join message
		const userJoinedMessage: Message = {
			message: `${data.user.username} joined the lobby!`,
			info: true,
		};
		setMessages((prev) => [...prev, userJoinedMessage]);
	};

	private handleUserLeft = (data: ClientUserLeft) => {
		setUsers((prev) =>
			prev.filter((user) => user.userId !== data.user.userId)
		);
		// show user left message
		const userLeftMessage: Message = {
			message: `${data.user.username} left the lobby.`,
			info: true,
		};
		setMessages((prev) => [...prev, userLeftMessage]);
	};

	private handleChatMessage = (data: ClientChatMessage) => {
		const message: Message = {
			user: data.user,
			message: data.message,
		};
		setMessages((prev) => [...prev, message]);
	};

	private handleHandPosition = (data: ClientHandPosition) => {
		setHandPosition((prev) => ({ ...prev, ...data.hand }));
	};
}
