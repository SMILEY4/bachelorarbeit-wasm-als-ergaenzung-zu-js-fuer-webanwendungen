use crate::vector::Vector;
use crate::sphere::Sphere;

/*
 * Struct holding data about an intersection 
 */
 #[derive(Copy, Clone)]
pub struct Intersection {
    // whether an object was hit
    pub hit_sth: bool,
    // the distance to the intersection
    pub distance: f32,
    // the coordinate of the intersection
    pub position: Vector,
    // the surface normal at the intersection-point
    pub normal: Vector,
    // the intersected object
    pub object: Sphere,
}

impl Intersection {
    // Intersected no object
    pub const NONE: Intersection = Intersection {
        hit_sth: false,
        distance: std::f32::MAX,
        position: Vector::ZERO,
        normal: Vector::ZERO,
        object: Sphere::NONE,
    };
}