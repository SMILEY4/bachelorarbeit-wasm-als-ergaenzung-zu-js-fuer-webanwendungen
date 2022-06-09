import { Vector } from './vector.js';
import { Intersection } from './intersection.js';
import { Scene } from './scene.js';
import { Sphere } from './sphere.js';

/*
 * Class holding data about a ray
 */
export class Ray {

	constructor(origin, direction) {
		// the origin location of the ray (vector)
		this.origin = origin;
		// the direction of the ray (vector)
		this.direction = direction;
	} 


	/**
	 * Reflect this ray at the given position and normal. Return the result as a new ray.
	 */
	reflect(position, normal) {
		return new Ray(position, Vector.reflectThrough(this.direction, normal));
	}

	/**
	 * Test for intersections between this ray and an object in the given scene. Return the closest intersection or Intersection.NONE.
	 */
	intersectScene(scene) {
		let closest = Intersection.NONE;
		for(let i=0; i<scene.objects.length; i++) {
			const object = scene.objects[i];
			const intersection = this.intersectSphere(object);
			if(intersection.hitSth && intersection.distance < closest.distance) {
				closest = intersection;
			}
		}
		return closest;
	}

	/**
	 * Test the given sphere for an intersection with this ray and return the intersection (or Intersection.NONE)
	 */
	intersectSphere(sphere) {
		const oc = Vector.sub(this.origin, sphere.center);
		const a = Vector.dot(this.direction, this.direction);
		const b = 2.0 * Vector.dot(oc, this.direction);
		const c = Vector.dot(oc,oc) - sphere.radius*sphere.radius;
		const discriminant = b*b - 4*a*c;
		if(discriminant > 0) {
			const distance = (-b - Math.sqrt(discriminant)) / (2.0*a);
			const position = Vector.add(this.origin, Vector.scale(this.direction, distance));
			const normal = Vector.unitVector(Vector.sub(position, sphere.center));
			return new Intersection(true, distance, position, normal, sphere);
		} else {
			return Intersection.NONE;
		}
	}

}
