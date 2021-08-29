export interface SocketData {
	type: string;
	[index: string]: any;
}

// data objects

export interface SocketUser {
	userId: string;
	username: string;
}

export interface SocketMessage {
	user: SocketUser;
	message: string;
}

export interface HandPosition {
	index: number;
	middle: number;
	ring: number;
	pinky: number;
	thumb: number;
}

// Sent from client to server

export interface ServerConnection {
	type: "connect";
	username: string;
	roomId: string;
}

export interface ServerChatMessage {
	type: "chatMessage";
	message: string;
}

export interface ServerHandPosition {
	type: "handPosition";
	hand: HandPosition;
}

// Sent from server to client

export interface ClientJoinRoom {
	type: "joinRoom";
	// client info
	client: SocketUser;
	// room info
	room: {
		roomId: string;
		users: SocketUser[];
		hostname: string;
	};
}

export interface ClientUserJoined {
	type: "userJoined";
	user: SocketUser;
}

export interface ClientUserLeft {
	type: "userLeft";
	user: SocketUser;
	room: {
		hostname: string;
	};
}

export interface ClientChatMessage {
	type: "chatMessage";
	user: SocketUser;
	message: string;
}

export interface ClientHandPosition {
	type: "handPosition";
	hand: HandPosition;
}
