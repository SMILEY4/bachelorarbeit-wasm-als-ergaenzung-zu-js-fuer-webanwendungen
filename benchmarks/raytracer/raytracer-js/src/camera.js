
/*
 * Class holding data about the camera 
 */
export class Camera {

	constructor(position, lookat, fov) {
		// position (vector) of the camera
		this.position = position;
		// coordinates (vector) to look at
		this.lookat = lookat;
		// field of view (angle in degrees)
		this.fov = fov;
	}

}