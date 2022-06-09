import { Vector } from './vector';
import { Intersection } from './intersection';
import { Scene } from './scene';
import { Sphere } from './sphere';

/*
 * Class holding data about a ray
 */
export class Ray {

	constructor(
		// the origin location of the ray
		public origin: Vector,
		// the direction of the ray
		public direction: Vector
	) {} 


	/**
	 * Reflect this ray at the given position and normal. Return the result as a new ray.
	 */
	reflect(position: Vector, normal: Vector): Ray {
		return new Ray(position, Vector.reflectThrough(this.direction, normal));
	}

	/*
	 * Test for intersections between this ray and an object in the given scene. Return the closest intersection or Intersection.NONE.
	 */
	intersectScene(scene: Scene): Intersection {
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

	/*
	 * Test the given sphere for an intersection with this ray and return the intersection (or Intersection.NONE)
	 */
	intersectSphere(sphere: Sphere): Intersection {
		const oc: Vector = Vector.sub(this.origin, sphere.center);
		const a: f32 = Vector.dot(this.direction, this.direction);
		const b: f32 = 2.0 * Vector.dot(oc, this.direction);
		const c: f32 = Vector.dot(oc,oc) - sphere.radius*sphere.radius;
		const discriminant = b*b - 4*a*c;
		if(discriminant > 0) {
			const distance: f32 = (-b - Mathf.sqrt(discriminant)) / (2.0*a);
			const position: Vector = Vector.add(this.origin, Vector.scale(this.direction, distance));
			const normal: Vector = Vector.unitVector(Vector.sub(position, sphere.center));
			return new Intersection(true, distance, position, normal, sphere);
		} else {
			return Intersection.NONE;
		}
	}

}
