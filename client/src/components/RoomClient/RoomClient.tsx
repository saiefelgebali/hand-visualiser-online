import { useNavigate, useParams } from "solid-app-router";
import { Component, createSignal, ErrorBoundary, onCleanup } from "solid-js";
import { SocketConnection } from "../../sockets/socket.connection";
import {
	username,
	setRoomId,
	setSocket,
	socket,
} from "../../context/room.state";
import Visualiser from "../Visualiser/Visualiser";
import UIMessage from "../UIMessage/UIMessage";
import { SOCKET_URL } from "../../settings";

const RoomClient: Component = () => {
	// handle loading and errors
	const [uiMessage, setUiMessage] = createSignal("Joining lobby...");

	// // extract roomId from urlParams
	// const params = useParams();
	// const roomId = params.roomId.toUpperCase();
	// setRoomId(roomId);

	// navigation
	const navigate = useNavigate();

	// redirect to home if no username
	if (!username()) {
		navigate("/");
		return null;
	}

	// socket handlers
	const onOpen = () => {
		setUiMessage(null);
	};

	const onError = () => {
		navigate("/");
		setSocket(null);
	};

	// set up socket
	setSocket(new SocketConnection(SOCKET_URL, { onOpen, onError }));

	// remove socket connection
	onCleanup(() => {
		socket().close();
		setSocket(null);
	});

	return (
		<ErrorBoundary
			fallback={
				<UIMessage message='There was a problem loading the client...' />
			}>
			{uiMessage() ? <UIMessage message={uiMessage()} /> : <Visualiser />}
		</ErrorBoundary>
	);
};

export default RoomClient;
