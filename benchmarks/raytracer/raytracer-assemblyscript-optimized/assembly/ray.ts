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
		this.direction.reflect(normal);
		this.origin.set(position);
		return this;
	}


	tmpIntersection: Intersection = Intersection.NONE.copy();

	/*
	 * Test for intersections between this ray and an object in the given scene. Return the closest intersection or Intersection.NONE.
	 */
	intersectScene(scene: Scene): Intersection {
		let closest = Intersection.NONE;
		for(let i=0; i<scene.objects.length; i++) {
			const object = scene.objects[i];
			const intersection = this.intersectSphere(object);
			if(intersection.hitSth && intersection.distance < closest.distance) {
				closest = intersection.copy();
			}
		}
		return closest;
	}

	tmpA: Vector = Vector.ZERO.copy();
	tmpB: Vector = Vector.ZERO.copy();
	tmpC: Vector = Vector.ZERO.copy();
	tmpD: Vector = Vector.ZERO.copy();

	/*
	 * Test the given sphere for an intersection with this ray and return the intersection (or Intersection.NONE)
	 */
	intersectSphere(sphere: Sphere): Intersection {
		const oc: Vector = this.tmpA.set(this.origin).sub(sphere.center);
		const a: f32 = Vector.dot(this.direction, this.direction);
		const b: f32 = 2.0 * Vector.dot(oc, this.direction);
		const c: f32 = Vector.dot(oc,oc) - sphere.radius*sphere.radius;
		const discriminant = b*b - 4*a*c;
		if(discriminant > 0) {
			const distance: f32 = (-b - Mathf.sqrt(discriminant)) / (2.0*a);
			const position: Vector = this.tmpB.set(this.origin).add( this.tmpC.set(this.direction).scale(distance) );
			const normal: Vector = this.tmpD.set(position).sub(sphere.center).normalize();
			this.tmpIntersection.hitSth = true;
			this.tmpIntersection.distance = distance;
			this.tmpIntersection.position = position;
			this.tmpIntersection.normal = normal;
			this.tmpIntersection.object = sphere;
			return this.tmpIntersection;
		} else {
			return Intersection.NONE;
		}
	}

}
