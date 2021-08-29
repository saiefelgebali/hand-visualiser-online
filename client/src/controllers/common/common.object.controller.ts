import { Object3D, Scene } from "three";
import { DEBUG } from "../../settings";

export class CommonObjectController {
	protected scene: Scene;
	protected object?: Object3D;

	constructor(scene: Scene) {
		this.scene = scene;
	}

	addToScene() {
		if (!this.object) return;
		if (DEBUG)
			console.log(
				"added object to scene:",
				this.object.name || this.object.type
			);
		this.scene.add(this.object);
		return this;
	}

	removeFromScene() {
		if (!this.object) return;
		console.log(
			"removed object from scene:",
			this.object.name || this.object.type
		);
		this.scene.remove(this.object);
		return this;
	}
}
