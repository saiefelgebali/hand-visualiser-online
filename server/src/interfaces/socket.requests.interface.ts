export interface SocketData {
	type: string;
	[index: string]: any;
}

export interface User {
	userId: string;
	username: string;
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
	client: User;
	// room info
	room: {
		roomId: string;
		users: User[];
		hostname: string;
	};
}

export interface ClientUserJoined {
	type: "userJoined";
	user: User;
}

export interface ClientUserLeft {
	type: "userLeft";
	user: User;
	room: {
		hostname: string;
	};
}

export interface ClientChatMessage {
	type: "chatMessage";
	user: User;
	message: string;
}

export interface ClientHandPosition {
	type: "handPosition";
	hand: Partial<HandPosition>;
}
