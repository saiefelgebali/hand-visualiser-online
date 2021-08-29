import * as THREE from "three";
import {
	Fog,
	GridHelper,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DirectionalLightController } from "../light/directional.light.controller";
import { HemiLightController } from "../light/hemi.light.controller";
import { HandController } from "../hand/hand.controller";
import { DEBUG } from "../../settings";
import { HandPosition } from "../../sockets/socket.requests.interface";

/**
 * ThreeJS Client Interface
 */
export class ClientController {
	private scene = new Scene();
	private camera: PerspectiveCamera;
	private renderer: WebGLRenderer;

	private controls: OrbitControls;

	private handController: HandController;
	private hemiLightController: HemiLightController;
	private dirLightController: DirectionalLightController;

	/**
	 * Instantiate ThreeJS components and start client on DOM
	 */
	constructor() {
		this.camera = new PerspectiveCamera(
			50,
			window.innerWidth / window.innerHeight
		);
		this.renderer = new WebGLRenderer({
			// canvas,
			antialias: true,
		});
		this.controls = new OrbitControls(
			this.camera,
			this.renderer.domElement
		);

		// Controllers
		this.hemiLightController = new HemiLightController(this.scene);
		this.dirLightController = new DirectionalLightController(this.scene);
		this.handController = new HandController(this.scene);
	}

	public getCanvas() {
		return this.renderer.domElement;
	}

	public start = () => {
		// start update loop
		this.update();
	};

	/**
	 * Setup scene and context.
	 */
	public setup = async (callback?: Function) => {
		if (DEBUG) console.log("starting three.js client");
		this.setSize();
		this.renderer.shadowMap.enabled = true; // enable shadows
		this.camera.position.z = -1;
		this.camera.position.y = 1.5;
		this.camera.position.x = 2;

		// Setup scene
		this.scene.background = new THREE.Color(0xffffff);
		this.scene.fog = new Fog(0xffffff, 0.1, 200);

		// setup floor
		const floor = new Mesh(
			new PlaneGeometry(2000, 2000, 1, 1),
			new MeshPhongMaterial({ color: 0xeeeeee, shininess: 0 })
		);
		floor.rotateX(-0.5 * Math.PI);
		floor.receiveShadow = true;
		floor.position.y = -1;
		this.scene.add(floor);

		// Setup lights
		this.hemiLightController.setup({
			position: { x: 0, y: 1, z: 0 },
			intensity: 0.6,
		});
		this.hemiLightController.addToScene();

		this.dirLightController.setup({
			position: { x: 0, y: 1, z: 1 },
			intensity: 0.5,
			castShadows: true,
		});
		this.dirLightController.addToScene();

		// Setup hand
		await this.handController.setup();
		this.handController.addToScene();

		// Handle window resize
		window.addEventListener("resize", () => {
			this.setSize();
			this.render();
		});

		// call callback
		if (callback) callback();

		// debug
		if (DEBUG) {
			const gridHelper = new GridHelper(100, 100);
			this.scene.add(gridHelper);
			this.dirLightController.debug();
			this.hemiLightController.debug();
		}
	};

	/**
	 * Update loop.
	 */
	private update = () => {
		requestAnimationFrame(this.update);

		this.controls.update();
		this.handController.update();

		this.render();
	};

	/**
	 * Render scene.
	 */
	private render = () => {
		this.renderer.render(this.scene, this.camera);
	};

	/**
	 * Set renderer size to fill window.
	 * Preserve aspect ratio.
	 */
	private setSize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	/**
	 * Set position of hand
	 */
	public setHandPosition = (handPosition: HandPosition) => {
		this.handController.setHandPosition(handPosition);
	};
}
