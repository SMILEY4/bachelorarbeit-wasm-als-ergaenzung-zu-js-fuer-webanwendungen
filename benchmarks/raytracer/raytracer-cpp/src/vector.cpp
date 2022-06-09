#pragma once

#include <math.h>

/*
 * Class holding data about a 3d-Vector and provides functions for operating on vectors
 */
class Vector {

	public:
		float x;
		float y;
		float z;

		static Vector UP;
		static Vector ZERO;
		static Vector WHITE;

		static Vector create(const float x, const float y, const float z) {
			Vector vec;
			vec.x = x;
			vec.y = y;
			vec.z = z;
			return vec;
		}

		static float dot(const Vector *a, const Vector *b) {
			return (a->x * b->x) + (a->y * b->y) + (a->z * b->z);
		}

		static Vector cross(const Vector *a, const Vector *b) {
			return Vector::create(
				(a->y * b->z) - (a->z * b->y),
				(a->z * b->x) - (a->x * b->z),
				(a->x * b->y) - (a->y * b->x)
			);
		}

		static Vector scale(const Vector *a, const float t) {
			return Vector::create(
				a->x * t,
				a->y * t,
				a->z * t
			);
		}

		static float length(const Vector *a) {
			return sqrt(Vector::dot(a, a));
		}

		static Vector unitVector(const Vector *a) {
			return Vector::scale(a, 1.0f / Vector::length(a));
		}

		static Vector add(const Vector *a, const Vector *b) {
			return Vector::create(
				a->x + b->x,
				a->y + b->y,
				a->z + b->z
			);
		}

		static Vector add3(const Vector *a, const Vector *b, const Vector *c) {
			return Vector::create(
				a->x + b->x + c->x,
				a->y + b->y + c->y,
				a->z + b->z + c->z
			);
		}

		static Vector sub(const Vector *a, const Vector *b) {
			return Vector::create(
				a->x - b->x,
				a->y - b->y,
				a->z - b->z
			);
		}

		static Vector mul(const Vector *a, const Vector *b) {
			return Vector::create(
				a->x * b->x,
				a->y * b->y,
				a->z * b->z
			);
		}

		static Vector mix(const Vector *a, const Vector *b, const float t) {
			return Vector::create(
				a->x * (1.0f - t) + b->x * t,
				a->y * (1.0f - t) + b->y * t,
				a->z * (1.0f - t) + b->z * t
			);
		}

		static Vector reflectThrough(const Vector *a, const Vector *normal) {
			const Vector d = Vector::scale(normal, Vector::dot(a, normal));
			const Vector ds = Vector::scale(&d, 2.0f);
            return Vector::sub(&ds, a);
		}

};


Vector Vector::UP = Vector::create(0.0f,-1.0f,0.0f);
Vector Vector::ZERO = Vector::create(0.0f,0.0f,0.0f);
Vector Vector::WHITE = Vector::create(1.0f,1.0f,1.0f);