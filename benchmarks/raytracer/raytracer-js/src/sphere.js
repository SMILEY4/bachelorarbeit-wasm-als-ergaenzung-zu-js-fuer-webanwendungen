import { Vector } from './vector.js';
import { Material } from './material.js';

/**
 * Class holding data about a sphere
 */
export class Sphere {

	// Dummy sphere
	static NONE = new Sphere(Vector.ZERO, 0, Material.NONE);

	constructor(center, radius, material) {
		// the position (vector) of the center of this sphere 
		this.center = center;
		// the radius of this sphere
		this.radius = radius;
		// the surface material
		this.material = material;
	}


}