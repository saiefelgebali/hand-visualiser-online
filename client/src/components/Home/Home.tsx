import { Link, useNavigate } from "solid-app-router";
import { Component, createEffect, createSignal, onMount } from "solid-js";
import {
	setUsername,
	username,
	roomId,
	setRoomId,
} from "../../context/room.state";
import styles from "./Home.module.scss";

// update store username based on input
function handleInputUsername(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	setUsername(input.value);
}
// update store roomId based on input
function handleInputRoomId(event: Event) {
	const input = event.currentTarget as HTMLInputElement;
	setRoomId(input.value);
}
// join room
function handleSubmitJoinRoom(event: Event) {}

const Home: Component = () => {
	const [canJoinRoom, setCanJoinRoom] = createSignal<boolean>();
	const navigation = useNavigate();

	onMount(() => {
		navigation("/home");
	});

	// update canJoinRoom state based on if required inputs are filled
	createEffect(() => {
		const canJoin = !!(username() && roomId());
		setCanJoinRoom(canJoin);
	});

	return (
		<div class={styles.home}>
			<form onSubmit={handleSubmitJoinRoom} class={styles.joinRoomForm}>
				<input
					onInput={handleInputUsername}
					type='text'
					name='username'
					placeholder='Username'
					maxLength='20'
					autocomplete='off'
					value={username()}
				/>
				<input
					onInput={handleInputRoomId}
					type='text'
					name='roomId'
					placeholder='Room ID'
					maxLength='8'
					autocomplete='off'
					value={roomId()}
				/>
				<Link
					href={`/room/${roomId()}`}
					classList={{
						[styles.submit]: true,
						[styles.disabled]: !canJoinRoom(),
					}}>
					<button>Join Room</button>
				</Link>
			</form>
		</div>
	);
};

export default Home;
