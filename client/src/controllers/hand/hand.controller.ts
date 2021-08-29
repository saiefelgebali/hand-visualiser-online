import { Bone, Mesh, Scene } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { HandPosition } from "../../sockets/socket.requests.interface";
import { CommonObjectController } from "../common/common.object.controller";

/**
 * Map out hand fingers
 */
interface Hand {
	thumb: Finger;
	index: Finger;
	middle: Finger;
	ring: Finger;
	pinky: Finger;
}
type Finger = Bone[];

export class HandController extends CommonObjectController {
	private gltfLoader = new GLTFLoader();
	private hand: Hand = {
		thumb: [],
		index: [],
		middle: [],
		ring: [],
		pinky: [],
	};

	constructor(scene: Scene) {
		super(scene);
	}

	public setup = async () => {
		const gltf = await this.gltfLoader.loadAsync("/models/hand_r.glb");

		const model = gltf.scene;

		model.traverse((child) => {
			// console.log(child.name);
			if (child instanceof Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if (child instanceof Bone) {
				this.mapBoneToHand(child);
			}
		});

		// scale model up
		model.scale.set(7, 7, 7);

		this.object = model;

		return this;
	};

	private mapBoneToHand = (bone: Bone) => {
		const matches = bone.name.match(/thumb|index|middle|ring|pinky/gm);
		if (!matches) return;

		const fingerName = matches[0] as keyof Hand;
		this.hand[fingerName].push(bone);
	};

	public update = () => {
		if (!this.object) return;
	};

	public bendFinger(fingerName: keyof Hand, amount: number) {
		const finger = this.hand[fingerName];
		const percentAmount = -amount / 100;

		if (fingerName == "thumb") {
			finger[2].rotation.z = percentAmount * (Math.PI * 0.4);
			return;
		}

		finger[0].rotation.x = percentAmount * (Math.PI * 0.5);
		finger[1].rotation.x = percentAmount * (Math.PI * 0.5);
	}

	public setHandPosition = (handPosition: HandPosition) => {
		for (const fingerName in handPosition) {
			this.bendFinger(fingerName as keyof Hand, handPosition[fingerName]);
		}
	};
}
