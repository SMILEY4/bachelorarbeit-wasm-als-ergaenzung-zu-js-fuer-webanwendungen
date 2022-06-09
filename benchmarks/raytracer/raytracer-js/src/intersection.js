import { Vector } from './vector.js';
import { Sphere } from './sphere.js';

/*
 * Class holding data about an intersection 
 */
export class Intersection {

	/**
	 * Intersected no object
	 */
	static NONE = new Intersection(false, Number.MAX_VALUE, Vector.ZERO, Vector.ZERO, Sphere.NONE);

	constructor(hitSth, distance, position, normal, object) {
		// whether an object was hit
		this.hitSth = hitSth;
		// the distance to the intersection
		this.distance = distance;
		// the coordinate (vector) of the intersection
		this.position = position;
		// the surface normal (vector) at the intersection-point
		this.normal = normal;
		// the intersected object (sphere)
		this.object = object;
	};

}