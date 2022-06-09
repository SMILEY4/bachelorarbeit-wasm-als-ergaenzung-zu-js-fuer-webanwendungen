import { Vector } from './vector';
import { Material } from './material';

/*
 * Class holding data about a sphere
 */
export class Sphere {

	// Dummy sphere
	static NONE: Sphere = new Sphere(Vector.ZERO, 0, Material.NONE);

	constructor(
		// the position of the center of this sphere 
		public center: Vector,
		// the radius of this sphere
		public radius: f32,
		// the surface material
		public material: Material,
	) {}


}