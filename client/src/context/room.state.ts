import { createSignal } from "solid-js";
import { HandPosition, SocketUser } from "../sockets/socket.requests.interface";
import { SocketConnection } from "../sockets/socket.connection";
import localStorageController from "../controllers/common/local.storage.controller";
import { Message } from "../components/Panels/ChatPanel";

// setup room state
export const [username, setUsername] = createSignal<string>(
	localStorageController.get("username")
);
export const [roomId, setRoomId] = createSignal<string>();
export const [socket, setSocket] = createSignal<SocketConnection>();
export const [users, setUsers] = createSignal<SocketUser[]>([]);
export const [messages, setMessages] = createSignal<Message[]>([]);
export const [handPosition, setHandPosition] = createSignal<HandPosition>();
