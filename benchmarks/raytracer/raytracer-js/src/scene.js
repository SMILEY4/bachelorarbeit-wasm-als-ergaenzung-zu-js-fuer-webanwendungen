import { Vector } from './vector.js';
import { Camera } from './camera.js';
import { Sphere } from './sphere.js';
import { Material } from './material.js';
import { RANDOM_VALUES } from './random.js';

export class Scene {

	constructor(width, height, maxDepth, camera, skyColor, lightColor, lights, objects) {
		// the width of the image
		this.width = width;
		// the height of the image
		this.height = height;
		// defines the max amount of bounces/reflections (0 = no reflections)
		this.maxDepth = maxDepth;
		// the camera
		this.camera = camera;
		// the color of the "sky"
		this.skyColor = skyColor;
		// the color of the lights
		this.lightColor = lightColor;
		// the position of the lights
		this.lights = lights;
		// the objects in the scene
		this.objects = objects;
	}

	/*
	 * create a new scene, including some fixed objects
	 */ 
	static createDefault(width, height, maxDepth) {
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
	addObject(obj) {
		this.objects.push(obj);
	}

	/*
	 * add "random" objects to the scene
	 */
	addRandomObjects() {
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