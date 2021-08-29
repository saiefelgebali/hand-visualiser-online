import { Component } from "solid-js";
import styles from "./UIMessage.module.scss";

const UIMessage: Component<{ message: string }> = ({ message }) => {
	return <div class={styles.UIMessage}>{message}</div>;
};

export default UIMessage;
