use crate::vector::Vector;
use crate::material::Material;

/*
 * Struct holding data about a sphere 
 */
 #[derive(Copy, Clone)]
pub struct Sphere {
    // the position of the center of this sphere 
    pub center: Vector,
    // the radius of this sphere
    pub radius: f32,
    // the surface material
    pub material: Material,
}

impl Sphere {
    // dummy sphere
    pub const NONE: Sphere = Sphere {
        center: Vector::ZERO,
        radius: 0.0,
        material: Material::NONE
    };
}