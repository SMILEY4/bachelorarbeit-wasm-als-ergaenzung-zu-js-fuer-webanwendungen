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

		return new Renderer(eyeVector, viewRight, viewUp, pixelWidth, pixelHeight, halfWidth, halfHeight);
	}


	/*
	 * Calculate the final color of the pixel at the given position
	 */
	renderPixel(scene: Scene, x: usize, y: usize): Vector {
		const camRayDir: Vector = this.calcCameraRayDirection(x, y);
		const ray: Ray = this.getCachedRay(0);
		ray.origin.set(scene.camera.position);
		ray.direction.set(this.calcCameraRayDirection(x, y));
		return this.trace(scene, ray, 0);
	}

	tmpXComp: Vector = Vector.ZERO.copy();
	tmpYComp: Vector = Vector.ZERO.copy();
	tmpCamRayDir: Vector = Vector.ZERO.copy();

	/*
	 * Calculate the direction of the ray for the pixel at the given position
	 */
	calcCameraRayDirection(x: usize, y: usize): Vector {
		this.tmpXComp = this.tmpXComp.set(this.viewRight).scale((x as f32) * this.pixelWidth - this.halfWidth);
		this.tmpYComp = this.tmpYComp.set(this.viewUp).scale((y as f32) * this.pixelHeight - this.halfHeight);
		this.tmpCamRayDir = this.tmpCamRayDir.set(this.eyeVector).add(this.tmpXComp).add(this.tmpYComp).normalize();
		return this.tmpCamRayDir;
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


	tmpL: Vector = Vector.ZERO.copy();
	tmpLightColor: Vector = Vector.ZERO.copy();
	tmpSkyColor: Vector = Vector.ZERO.copy();

	/*
	 * Calculate the color of the surface at the given intersection 
	 */
	surface(scene: Scene, ray: Ray, intersection: Intersection, depth: usize): Vector {
		const simpleShading: boolean = false;
		
		const object: Sphere = intersection.object;
		const V: Vector = Vector.scale(ray.direction, -1);
		const N: Vector = intersection.normal;
		const L: Vector = this.tmpL.set(scene.lights[0]).sub(intersection.position).normalize().copy();

		let lightVisibility: f32 = 0.2;
		if(this.isLightVisible(scene, intersection.position, L)) {
			lightVisibility = 1.0;
		}
		if(simpleShading) {
			return object.material.shadeSimple(lightVisibility);
		} else {
			const reflection = this.getReflection(scene, ray, intersection.position, intersection.normal, depth).copy();
			this.tmpLightColor.set(scene.lightColor).scale(lightVisibility);
			this.tmpSkyColor.set(scene.skyColor).scale(0.1);
			return object.material.shade(V, N, L, this.tmpLightColor, reflection, this.tmpSkyColor);
		}
	}


	/*
	 * get the color of the reflection of the ray at the given position 
	 */
	getReflection(scene: Scene, ray: Ray, position: Vector, normal: Vector, depth: usize): Vector {
		const reflectedRay: Ray = this.getCachedRay(depth+1)
		reflectedRay.origin.set(ray.origin);
		reflectedRay.direction.set(ray.direction);
		reflectedRay.reflect(position, normal);
		return this.trace(scene, reflectedRay, depth+1);
	}

	/*
	 * Check whether the light is visible from the given position
	 */
	isLightVisible(scene: Scene, position: Vector, lightDirection: Vector): boolean {
		const shadowRay: Ray = this.getCachedRay(-1);
		shadowRay.origin.set(position);
		shadowRay.direction.set(lightDirection).scale(-1);
		const intersection = shadowRay.intersectScene(scene);
		return intersection.distance > -0.005;
	}



	ray0: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	ray1: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	ray2: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	ray3: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	ray4: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	ray5: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	rayS: Ray = new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());

	getCachedRay(depth: usize): Ray {
		if(depth === -1) return this.rayS;
		if(depth === 0) return this.ray0;
		if(depth === 1) return this.ray1;
		if(depth === 2) return this.ray2;
		if(depth === 3) return this.ray3;
		if(depth === 4) return this.ray4;
		if(depth === 5) return this.ray5;
		return new Ray(Vector.ZERO.copy(), Vector.ZERO.copy());
	}

}

