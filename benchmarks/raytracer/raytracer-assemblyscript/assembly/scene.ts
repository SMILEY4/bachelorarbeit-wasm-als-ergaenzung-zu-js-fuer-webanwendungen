import { Vector } from './vector';
import { Camera } from './camera';
import { Sphere } from './sphere';
import { Material } from './material';
import { RANDOM_VALUES } from './random'

export class Scene {

	constructor(
		// the width of the image
		public width: f32,
		// the height of the image
		public height: f32,
		// defines the max amount of bounces/reflections (0 = no reflections)
		public maxDepth: usize,
		// the camera
		public camera: Camera,
		// the color of the "sky"
		public skyColor: Vector,
		// the color of the lights
		public lightColor: Vector,
		// the position of the lights
		public lights: Vector[],
		// the objects in the scene
		public objects: Sphere[]
	) {}

	/*
	 * create a new scene, including some fixed objects
	 */ 
	static createDefault(width: f32, height: f32, maxDepth: usize): Scene {
		return new Scene(
			width,
			height,
			maxDepth,
			new Camera(
				new Vector(-10, 14, 20),
				new Vector(0,0,0),
				60.0
			),
			new Vector(1.0, 1.0, 1.0),
			new Vector(1.5, 1.5, 1.5),
			[
				new Vector(0, 10.0, 20.0)
			],
			[
				new Sphere(
					new Vector(0.0, 7.0, -8.0),
					3.0,
					new Material(1.0, 0.0, new Vector(1.0, 0.4, 0.4))
				),
				new Sphere(
					new Vector(0.0, -30.0, -8.0),
					30.0,
					new Material(0, 0.1, new Vector(0.9, 0.9, 0.9))
				)
			]
		);
	}

	/*
	 * add the given object to this scene
	 */
	addObject(obj: Sphere): void {
		this.objects.push(obj);
	}

	/*
	 * add "random" objects to the scene
	 */
	addRandomObjects(): void {
		let indexRandom = 0;
		for (let i = 0; i < 30; i++) {
			this.addObject(new Sphere(
				new Vector(
					RANDOM_VALUES[indexRandom++] * 25 - 12,
					RANDOM_VALUES[indexRandom++] * 20 - 10,
					RANDOM_VALUES[indexRandom++] * 25 - 12
				),
				RANDOM_VALUES[indexRandom++] * 2.0 + 0.4,
				new Material(
					RANDOM_VALUES[indexRandom++] < 0.5 ? 0.0 : 1.0,
					RANDOM_VALUES[indexRandom++],
					new Vector(
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3,
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3,
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3
					),
				)
			));
		}
		for (let i = 0; i < 10; i++) {
			this.addObject(new Sphere(
				new Vector(
					RANDOM_VALUES[indexRandom++] * 14 - 7,
					0,
					RANDOM_VALUES[indexRandom++] * 14 - 7
				),
				RANDOM_VALUES[indexRandom++] * 2.0 + 0.4,
				new Material(
					RANDOM_VALUES[indexRandom++] < 0.5 ? 0.0 : 1.0,
					RANDOM_VALUES[indexRandom++],
					new Vector(
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3,
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3,
						RANDOM_VALUES[indexRandom++] * 0.7 + 0.3
					),
				)
			));
		}
	}

}