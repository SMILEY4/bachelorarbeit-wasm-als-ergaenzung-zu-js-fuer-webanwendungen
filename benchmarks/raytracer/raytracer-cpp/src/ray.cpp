#pragma once

#include <math.h>
#include "vector.cpp"
#include "intersection.cpp"
#include "scene.cpp"
#include "sphere.cpp"


/*
 * Class holding data about a ray
 */
class Ray {

	public:
		// the origin location of the ray
		Vector origin;
		// the direction of the ray
		Vector direction;

		static Ray create(const Vector *origin, const Vector *direction) {
			Ray ray;
			ray.origin = *origin;
			ray.direction = *direction;
			return ray;
		}

		/**
		 * Reflect this ray at the given position and normal. Return the result as a new ray.
		 */
		Ray reflect(const Vector *position, const Vector *normal) const {
			Vector reflected = Vector::reflectThrough(&direction, normal);
			return Ray::create(position, &reflected);
		}

		/*
		 * Test the given sphere for an intersection with this ray and return the intersection (or Intersection.NONE)
		 */
		Intersection intersectSphere(const Sphere *sphere) const {
			Vector oc = Vector::sub(&origin, &(sphere->center));
			float a = Vector::dot(&direction, &direction);
			float b = 2.0f * Vector::dot(&oc, &direction);
			float c = Vector::dot(&oc, &oc) - sphere->radius*sphere->radius;
			float discriminant = b*b - 4.0f*a*c;
			if(discriminant > 0.0f) {
				float distance = (-b - sqrt(discriminant)) / (2.0f*a);
				Vector position = Vector::add(&origin, &((const Vector &) Vector::scale(&direction, distance)));
				Vector normal = Vector::unitVector(&((const Vector &) Vector::sub(&position, &(sphere->center))));
				return Intersection::create(true, distance, &position, &normal, sphere);
			} else {
				return Intersection::NONE;
			}
		}

		/*
		 * Test for intersections between this ray and an object in the given scene. Return the closest intersection or Intersection.NONE.
		 */
		Intersection intersectScene(const Scene *scene) const {
			Intersection closest = Intersection::NONE;
			for(int i=0; i<scene->objects.size(); i++) {
				const Sphere object = scene->objects[i];
				const Intersection intersection = intersectSphere(&object);
				if(intersection.hitSth && intersection.distance < closest.distance) {
					closest = intersection;
				}
			}
			return closest;
		}

};
