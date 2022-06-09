import { Vector } from './vector';
import { Camera } from './camera';
import { Sphere } from './sphere';
import { Scene } from './scene';
import { Ray } from './ray';
import { Intersection } from './intersection';
import { Material } from './material';

/*
 * Class holding data about the current rendering process and provides the core rendering logic
 */
export class Renderer {

	constructor(
		public eyeVector: Vector,
		public viewRight: Vector,
		public viewUp: Vector,
		public pixelWidth: f32,
		public pixelHeight: f32,
		public halfWidth: f32,
		public halfHeight: f32,
		public cameraRay: Ray,
	) {}


	/*
	 * Create a new renderer for the given scene
	 */
	static create(scene: Scene): Renderer {
		const eyeVector = Vector.unitVector(Vector.sub(scene.camera.lookat, scene.camera.position));
		const viewRight = Vector.unitVector(Vector.cross(eyeVector, Vector.UP));
		const viewUp = Vector.unitVector(Vector.cross(viewRight, eyeVector));
		
		const fovRadians: f32 = (Mathf.PI * (scene.camera.fov / 2)) / 180;
		const heightWidthRatio = scene.height / scene.width;
		const halfWidth: f32 = Mathf.tan(fovRadians);
		const halfHeight = heightWidthRatio * halfWidth;
		const cameraWidth = halfWidth * 2;
		const cameraHeight = halfHeight * 2;
		const pixelWidth = cameraWidth / (scene.width - 1);
		const pixelHeight = cameraHeight / (scene.height - 1);

		const ray = new Ray(scene.camera.position, Vector.ZERO);
		return new Renderer(eyeVector, viewRight, viewUp, pixelWidth, pixelHeight, halfWidth, halfHeight, ray);
	}


	/*
	 * Calculate the final color of the pixel at the given position
	 */
	renderPixel(scene: Scene, x: usize, y: usize): Vector {
		this.cameraRay.direction = this.calcCameraRayDirection(x, y);
		return this.trace(scene, this.cameraRay, 0);
	}

	/*
	 * Calculate the direction of the ray for the pixel at the given position
	 */
	calcCameraRayDirection(x: usize, y: usize): Vector {
		const xComp = Vector.scale(this.viewRight, (x as f32) * this.pixelWidth - this.halfWidth);
		const yComp = Vector.scale(this.viewUp, (y as f32) * this.pixelHeight - this.halfHeight);
		return Vector.unitVector(Vector.add3(this.eyeVector, xComp, yComp));
	}


	/*
	 * Trace the ray(s) through the scene and return the resulting color 
	 */
	trace(scene: Scene, ray: Ray, depth: usize): Vector {
		if(depth > scene.maxDepth) {
			return scene.skyColor;
		}
		const intersection = ray.intersectScene(scene);
		if(intersection.hitSth) {
			return this.surface(scene, ray, intersection, depth);
		} else {
			return scene.skyColor;
		}
	}


	/*
	 * Calculate the color of the surface at the given intersection 
	 */
	surface(scene: Scene, ray: Ray, intersection: Intersection, depth: usize): Vector {
		const simple_shading: boolean = false;
		
		const object: Sphere = intersection.object;
		const V: Vector = Vector.scale(ray.direction, -1);
		const N: Vector = intersection.normal;
		const L: Vector = Vector.unitVector(Vector.sub(scene.lights[0], intersection.position));

		let lightVisibility: f32 = 0.2;
		if(this.isLightVisible(scene, intersection.position, L)) {
			lightVisibility = 1.0;
		}
		if(simple_shading) {
			return object.material.shadeSimple(lightVisibility);
		} else {
			const reflection = this.getReflection(scene, ray, intersection.position, intersection.normal, depth);
			return object.material.shade(V, N, L, Vector.scale(scene.lightColor, lightVisibility), reflection, Vector.scale(scene.skyColor, 0.1));
		}
	}


	/*
	 * get the color of the reflection of the ray at the given position 
	 */
	getReflection(scene: Scene, ray: Ray, position: Vector, normal: Vector, depth: usize): Vector {
		const reflectedRay = ray.reflect(position, normal);
		return this.trace(scene, reflectedRay, depth+1);
	}

	/*
	 * Check whether the light is visible from the given position
	 */
	isLightVisible(scene: Scene, position: Vector, lightDirection: Vector): boolean {
		const shadowRay = new Ray(position, Vector.scale(lightDirection, -1.0));
		const intersection = shadowRay.intersectScene(scene);
		return intersection.distance > -0.005;
	}

}

