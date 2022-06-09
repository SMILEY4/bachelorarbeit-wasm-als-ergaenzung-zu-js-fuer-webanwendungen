#pragma once

#include "vector.cpp"
#include "material.cpp"

/*
 * Class holding data about a sphere
 */
class Sphere {

	public:
		// the position of the center of this sphere 
		Vector center;
		// the radius of this sphere
		float radius;
		// the surface material
		Material material;

		// dummy sphere
		static Sphere NONE;

		static Sphere create(const Vector *center, const float radius, const Material *material) {
			Sphere sphere;
			sphere.center = *center;
			sphere.radius = radius;
			sphere.material = *material;
			return sphere;
		}
};

Sphere Sphere::NONE = Sphere::create(&Vector::ZERO, 0.0, &Material::NONE);