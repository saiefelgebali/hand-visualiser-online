import { Route, Router, Routes } from "solid-app-router";
import { Component, createEffect, ErrorBoundary } from "solid-js";
import Home from "./components/Home/Home";
import OfflineClient from "./components/OfflineClient/OfflineClient";
import RoomClient from "./components/RoomClient/RoomClient";
import UIMessage from "./components/UIMessage/UIMessage";
import { username } from "./context/room.state";
import localStorageController from "./controllers/common/local.storage.controller";

const App: Component = () => {
	// keep username synced with localstorage
	createEffect(() => {
		if (!username()) return;
		localStorageController.set("username", username());
	});

	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/home' element={<Home />} />
				<Route path='/offline' element={<OfflineClient />} />
				<Route
					path='/room/:roomId'
					element={
						<ErrorBoundary
							fallback={
								<UIMessage message='Could not join room...' />
							}>
							<RoomClient />
						</ErrorBoundary>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
