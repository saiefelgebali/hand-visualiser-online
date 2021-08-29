import { onError } from "solid-js";
import { SocketController } from "./socket.controller";

interface SocketHandlerFunctions {
	onOpen: (event: Event) => void;
	onClose: (event: Event) => void;
	onMessage: (data: Event) => void;
	onError: (event: Event) => void;
}

// define websocket connections to server
export class SocketConnection {
	private socket: WebSocket;
	public controller = new SocketController(this);

	constructor(url: string, handlers: Partial<SocketHandlerFunctions>) {
		this.socket = new WebSocket(url);

		// handle socket open
		this.socket.onopen = (event) => {
			if (handlers.onOpen) handlers.onOpen(event);
			this.controller.onSocketOpen();
		};
		// handle socket message
		this.socket.onmessage = (event) => {
			if (handlers.onMessage) handlers.onMessage(event);
			this.controller.onSocketMessage(JSON.parse(event.data));
		};
		// handle socket close
		this.socket.onclose = (event) => {
			if (handlers.onClose) handlers.onClose(event);
			this.controller.onSocketClose();
		};

		// handle socket error
		this.socket.onerror = (event) => {
			if (handlers.onError) handlers.onError(event);
		};
	}

	// JSON stringify and send to server
	public emit(data: Object) {
		if (this.socket.readyState === WebSocket.OPEN)
			this.socket.send(JSON.stringify(data));
	}

	// close websocket connection
	public close() {
		this.socket.close();
	}
}
