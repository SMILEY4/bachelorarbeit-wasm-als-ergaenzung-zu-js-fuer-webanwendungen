import { Vector } from './vector.js';
import { Camera } from './camera.js';
import { Sphere } from './sphere.js';
import { Scene } from './scene.js';
import { Ray } from './ray.js';
import { Intersection } from './intersection.js';
import { Material } from './material.js';
import {countRay} from "./raycount.js"

/*
 * Class holding data about the current rendering process and provides the core rendering logic
 */
export class Renderer {

	constructor(eyeVector,viewRight,viewUp,pixelWidth,pixelHeight,halfWidth,halfHeight,cameraRay) {
		this.eyeVector = eyeVector;
		this.viewRight = viewRight;
		this.viewUp = viewUp;
		this.pixelWidth = pixelWidth;
		this.pixelHeight = pixelHeight;
		this.halfWidth = halfWidth;
		this.halfHeight = halfHeight;
		this.cameraRay = cameraRay;
	}


	/*
	 * Create a new renderer for the given scene
	 */
	static create(scene) {
		const eyeVector = Vector.unitVector(Vector.sub(scene.camera.lookat, scene.camera.position));
		const viewRight = Vector.unitVector(Vector.cross(eyeVector, Vector.UP));
		const viewUp = Vector.unitVector(Vector.cross(viewRight, eyeVector));
		
		const fovRadians = (Math.PI * (scene.camera.fov / 2)) / 180;
		const heightWidthRatio = scene.height / scene.width;
		const halfWidth = Math.tan(fovRadians);
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
	renderPixel(scene, x, y) {
		this.cameraRay.direction = this.calcCameraRayDirection(x, y);
		return this.trace(scene, this.cameraRay, 0);
	}

	/*
	 * Calculate the direction of the ray for the pixel at the given position
	 */
	calcCameraRayDirection(x, y) {
		const xComp = Vector.scale(this.viewRight, x * this.pixelWidth - this.halfWidth);
		const yComp = Vector.scale(this.viewUp, y * this.pixelHeight - this.halfHeight);
		return Vector.unitVector(Vector.add3(this.eyeVector, xComp, yComp));
	}


	/*
	 * Trace the ray(s) through the scene and return the resulting color 
	 */
	trace(scene, ray, depth) {
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
	surface(scene, ray, intersection, depth) {
		const simpleShading = false;
		
		const object = intersection.object;
		const V = Vector.scale(ray.direction, -1);
		const N = intersection.normal;
		const L = Vector.unitVector(Vector.sub(scene.lights[0], intersection.position));

		let lightVisibility = 0.2;
		if(this.isLightVisible(scene, intersection.position, L)) {
			lightVisibility = 1.0;
		}
		if(simpleShading) {
			return object.material.shadeSimple(lightVisibility);
		} else {
			const reflection = this.getReflection(scene, ray, intersection.position, intersection.normal, depth);
			return object.material.shade(V, N, L, Vector.scale(scene.lightColor, lightVisibility), reflection, Vector.scale(scene.skyColor, 0.1));
		}
	}


	/*
	 * get the color of the reflection of the ray at the given position 
	 */
	getReflection(scene, ray, position, normal, depth) {
		const reflectedRay = ray.reflect(position, normal);
		return this.trace(scene, reflectedRay, depth+1);
	}

	/*
	 * Check whether the light is visible from the given position
	 */
	isLightVisible(scene, position, lightDirection) {
		const shadowRay = new Ray(position, Vector.scale(lightDirection, -1.0));
		const intersection = shadowRay.intersectScene(scene);
		return intersection.distance > -0.005;
	}

}

