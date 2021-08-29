import { Component, For } from "solid-js";
import {
	handPosition,
	setHandPosition,
	socket,
} from "../../context/room.state";
import { HandPosition } from "../../sockets/socket.requests.interface";
import styles from "./panel.styles.module.scss";

// map out all available fingers to control
const fingers: (keyof HandPosition)[] = [
	"thumb",
	"index",
	"middle",
	"ring",
	"pinky",
];

// allow user to control fingers
const ControlsPanel: Component = () => {
	return (
		<div class={styles.controlsPanel}>
			<div class={styles.title}>Controls</div>

			<For each={fingers}>
				{(fingerName) => <FingerInput fingerName={fingerName} />}
			</For>
		</div>
	);
};

const FingerInput: Component<{ fingerName: keyof HandPosition }> = ({
	fingerName,
}) => {
	function handleInput(event) {
		const input = event.target as HTMLInputElement;
		const name = input.name as keyof HandPosition;
		const value = input.valueAsNumber;
		setHandPosition((prev) => ({ ...prev, [name]: value }));
		socket().controller.sendHandPosition(handPosition());
	}

	return (
		<div class={styles.inputGroup}>
			<label htmlFor={fingerName}>{fingerName.toUpperCase()}</label>
			<input
				name={fingerName}
				onInput={handleInput}
				type='range'
				value={0}
			/>
		</div>
	);
};

export default ControlsPanel;
