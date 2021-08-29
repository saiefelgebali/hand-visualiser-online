import { Component, createEffect, createSignal, onMount } from "solid-js";
import { handPosition } from "../../context/room.state";
import { ClientController } from "../../controllers/common/client.controller";
import UIMessage from "../UIMessage/UIMessage";
import ChatPanel from "../Panels/ChatPanel";
import ControlsPanel from "../Panels/ControlsPanel";
import RoomPanel from "../Panels/RoomPanel";

// set up three.js clientController
const [clientController] = createSignal(new ClientController());

// canvas that will contain three.js client
const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

// handle loading state
const [uiMessage, setUiMessage] = createSignal("Loading client...");

const Visualiser: Component<{ offline?: boolean }> = ({ offline }) => {
	// update hand position on state change
	createEffect(() => {
		if (handPosition()) clientController().setHandPosition(handPosition());
	});

	// setup three.js on mount component
	onMount(async () => {
		if (canvas()) return;
		await clientController().setup();
		clientController().start();
		setCanvas(clientController().getCanvas());
		setUiMessage(null);
	});

	const RoomUI: Component = () => (
		<>
			<RoomPanel />
			<ChatPanel />
		</>
	);
	const ClientUI: Component = () => (
		<>
			{!offline && <RoomUI />}
			<ControlsPanel />
			{canvas()}
		</>
	);

	return (
		<>{uiMessage() ? <UIMessage message={uiMessage()} /> : <ClientUI />}</>
	);
};

export default Visualiser;
