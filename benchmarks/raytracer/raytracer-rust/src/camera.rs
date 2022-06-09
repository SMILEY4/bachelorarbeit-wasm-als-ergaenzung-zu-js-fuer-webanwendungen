use crate::vector::Vector;


/*
 * Struct holding data about the camera 
 */
#[derive(Copy, Clone)]
pub struct Camera {
    // position of the camera
    pub position: Vector,
    // coordinates to look at
    pub lookat: Vector,
    // field of view (angle in degrees)
    pub fov: f32,
}