import { HemisphereLight, HemisphereLightHelper, Scene } from "three";
import { CommonObjectController } from "../common/common.object.controller";
import { Position3D } from "../../interfaces/position.3d.interface";
import { DEBUG_COLOR } from "../../settings";

interface HemiLightOptions {
	position?: Position3D;
	intensity?: number;
}

export class HemiLightController extends CommonObjectController {
	// Optional helper for debug
	private helper?: HemisphereLightHelper;

	constructor(scene: Scene) {
		super(scene);
		return this;
	}

	public setup(options: HemiLightOptions = {}) {
		const { intensity = 1, position = { x: 0, y: 0, z: 0 } } = options;
		const light = new HemisphereLight(0xffffff, 0xffffff, intensity);
		light.position.set(position.x, position.y, position.z);
		this.object = light;
		return this;
	}

	public debug() {
		this.helper = new HemisphereLightHelper(
			this.object as HemisphereLight,
			1,
			DEBUG_COLOR
		);
		this.scene.add(this.helper);
	}

	// public update() {}
}
