use crate::vector::Vector;
use crate::sphere::Sphere;
use crate::intersection::Intersection;
use crate::scene::Scene;

/*
 * Struct holding data about a ray
 */
 #[derive(Copy, Clone)]
pub struct Ray {
    // the origin location of the ray
    pub origin: Vector,
    // the direction of the ray
    pub direction: Vector
}

impl Ray {

    /*
     * Reflect this ray at the given position and normal. Return the result as a new ray.
     */
    pub fn reflect(self: &Self, position: Vector, normal: Vector) -> Ray {
        return Ray {
            origin: position,
            direction: Vector::reflect_through(self.direction, normal)
        };
    }


    /*
     * Test for intersections between this ray and an object in the given scene. Return the closest intersection or Intersection.NONE.
     */
    pub fn intersect_scene(self: &Self, scene: &Scene) -> Intersection {
        let mut closest = Intersection::NONE;
        for i in 0..scene.objects.len() {
            let object = scene.objects[i];
            let intersection = self.intersect_sphere(object);
            if intersection.hit_sth && intersection.distance < closest.distance {
                closest = intersection;
            }
        }
        return closest;
    }

    /*
     * Test the given sphere for an intersection with this ray and return the intersection (or Intersection.NONE)
     */
    fn intersect_sphere(self: &Self, sphere: Sphere) -> Intersection {
        let oc: Vector = Vector::sub(self.origin, sphere.center);
        let a: f32 = Vector::dot(self.direction, self.direction);
        let b: f32 = 2.0 * Vector::dot(oc, self.direction);
        let c: f32 = Vector::dot(oc,oc) - sphere.radius*sphere.radius;
        let discriminant = b*b - 4.0*a*c;
        if discriminant > 0.0 {
            let distance: f32 = (-b - f32::sqrt(discriminant)) / (2.0*a);
            let position: Vector = Vector::add(self.origin, Vector::scale(self.direction, distance));
            let normal: Vector = Vector::unit_vector(Vector::sub(position, sphere.center));
            return Intersection {
                hit_sth: true,
                distance: distance,
                position: position,
                normal: normal,
                object: sphere
            };
        } else {
            return Intersection::NONE;
        }
    }

}