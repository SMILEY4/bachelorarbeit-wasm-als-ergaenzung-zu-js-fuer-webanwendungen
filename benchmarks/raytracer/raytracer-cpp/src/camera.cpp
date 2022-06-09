#pragma once

#include "vector.cpp"

/*
 * Class holding data about the camera 
 */
class Camera {

	public:
		// position of the camera
		Vector position;
		// coordinates to look at
		Vector lookat;
		// field of view (angle in degrees)
		float fov;

		static Camera create(const Vector *position, const Vector *lookat, const float fov) {
			Camera cam;
			cam.position = *position;
			cam.lookat = *lookat;
			cam.fov = fov;
			return cam;
		}
};