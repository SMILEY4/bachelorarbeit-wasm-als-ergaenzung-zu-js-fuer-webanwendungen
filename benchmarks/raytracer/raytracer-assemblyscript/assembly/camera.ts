import { Vector } from './vector';

/*
 * Class holding data about the camera 
 */
export class Camera {

	constructor(
		// position of the camera
		public position: Vector,
		// coordinates to look at
		public lookat: Vector,
		// field of view (angle in degrees)
		public fov: f32
	) {}

}