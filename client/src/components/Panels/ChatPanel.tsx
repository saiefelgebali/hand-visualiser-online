import { Component, createEffect, For } from "solid-js";
import { SocketUser } from "../../sockets/socket.requests.interface";
import { messages, socket } from "../../context/room.state";
import styles from "./panel.styles.module.scss";

export interface Message {
	user?: SocketUser;
	message: string;
	info?: boolean;
}

// display chat messages
// allow to send messages to room
const ChatPanel: Component = () => {
	// const MessageBoxRef = ref
	return (
		<div class={styles.chatPanel}>
			<MessageBox />
			<MessageInput />
		</div>
	);
};

export default ChatPanel;

// display all room messages
const MessageBox: Component = () => {
	// ref message box element
	let messageBox: HTMLDivElement;

	// scroll to bottom on messages change
	createEffect(() => {
		if (messages()) messageBox.scrollTop = messageBox.scrollHeight;
	});

	return (
		<div class={styles.chatBox} ref={messageBox}>
			<For each={messages()}>
				{(message) => <Message message={message} />}
			</For>
		</div>
	);
};

// display one message
const Message: Component<{ message: Message }> = ({ message }) => {
	const Username = () =>
		message.user ? (
			<span class={styles.username}>{message.user.username}</span>
		) : null;
	return (
		<div
			classList={{ [styles.message]: true, [styles.info]: message.info }}>
			<Username />
			<span class={styles.message}>{message.message}</span>
		</div>
	);
};

// allow user input message
const MessageInput: Component = () => {
	function handleSubmit(event: Event) {
		event.preventDefault();
		// send message to room
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const message = formData.get("message") as string;
		socket().controller.sendChatMessage(message);
		// reset form
		form.reset();
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type='text' name='message' autocomplete='off' />
			<button>Send</button>
		</form>
	);
};
