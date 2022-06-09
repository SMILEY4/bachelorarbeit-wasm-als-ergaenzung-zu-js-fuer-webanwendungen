#pragma once

#include "vector.cpp"
#include "sphere.cpp"
#include <limits>

/*
 * Class holding data about an intersection 
 */
class Intersection {

	public:
		// whether an object was hit
		bool hitSth;
		// the distance to the intersection
		float distance;
		// the coordinate of the intersection
		Vector position;
		// the surface normal at the intersection-point
		Vector normal;
		// the intersected object
		Sphere object;

		// Intersected no object
		static Intersection NONE;

		static Intersection create(const bool hitSth, const float distance, const Vector *position, const Vector *normal, const Sphere *object) {
			Intersection intersection;
			intersection.hitSth = hitSth;
			intersection.distance = distance;
			intersection.position = *position;
			intersection.normal = *normal;
			intersection.object = *object;
			return intersection;
		}
};

Intersection Intersection::NONE = Intersection::create(false, std::numeric_limits<float>::max(), &Vector::ZERO, &Vector::ZERO, &Sphere::NONE);