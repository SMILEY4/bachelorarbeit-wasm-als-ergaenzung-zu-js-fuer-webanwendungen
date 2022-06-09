import { Vector } from './vector';
import { Sphere } from './sphere';

/*
 * Class holding data about an intersection 
 */
export class Intersection {

	// Intersected no object
	static NONE: Intersection = new Intersection(false, F32.MAX_VALUE, Vector.ZERO, Vector.ZERO, Sphere.NONE);

	constructor(
		// whether an object was hit
		public hitSth: boolean,
		// the distance to the intersection
		public distance: f32,
		// the coordinate of the intersection
		public position: Vector,
		// the surface normal at the intersection-point
		public normal: Vector,
		// the intersected object
		public object: Sphere,
	) {};

}