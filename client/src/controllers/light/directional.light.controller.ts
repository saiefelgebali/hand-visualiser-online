import {
	DirectionalLight,
	DirectionalLightHelper,
	Scene,
	Vector2,
} from "three";
import { CommonObjectController } from "../common/common.object.controller";
import { Position3D } from "../../interfaces/position.3d.interface";
import { DEBUG, DEBUG_COLOR } from "../../settings";

interface DirectionalLightOptions {
	position?: Position3D;
	intensity?: number;
	castShadows?: boolean;
	shadowCamFrustum?: number;
}

export class DirectionalLightController extends CommonObjectController {
	// Optional helper for debug
	private helper?: DirectionalLightHelper;

	constructor(scene: Scene) {
		super(scene);
		return this;
	}

	public setup(options: DirectionalLightOptions = {}) {
		const {
			position = { x: 0, y: 0, z: 0 },
			intensity = 1,
			castShadows = false,
			shadowCamFrustum = 1.5,
		} = options;

		const light = new DirectionalLight(0xffffff, intensity);
		light.position.set(position.x, position.y, position.z);

		if (castShadows) {
			light.castShadow = castShadows;
			light.shadow.mapSize = new Vector2(1024, 1024);

			const d = shadowCamFrustum;
			light.shadow.camera.left = -d;
			light.shadow.camera.right = d;
			light.shadow.camera.top = d;
			light.shadow.camera.bottom = -d;
		}

		this.object = light;
		return this;
	}

	public debug() {
		this.helper = new DirectionalLightHelper(
			this.object as DirectionalLight,
			1,
			DEBUG_COLOR
		);
		this.scene.add(this.helper);
	}

	// public update() {}
}
