import { Component, For } from "solid-js";
import { SocketUser } from "../../sockets/socket.requests.interface";
import { roomId, users } from "../../context/room.state";
import styles from "./panel.styles.module.scss";

// display user username in a list
const Username: Component<{ user: SocketUser }> = ({ user }) => {
	return <div class={styles.username}>{user.username}</div>;
};

// display room info
const RoomPanel: Component = () => {
	return (
		<div class={styles.roomPanel}>
			<div class={styles.roomID}>Room ID: {roomId()}</div>
			<div className={styles.title}>Users ({users().length})</div>
			<div class={styles.userList}>
				<For each={users()}>{(user) => <Username user={user} />}</For>
			</div>
		</div>
	);
};

export default RoomPanel;
