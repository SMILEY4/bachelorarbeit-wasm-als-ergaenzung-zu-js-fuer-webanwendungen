use crate::vector::Vector;
use crate::ray::Ray;
use crate::scene::Scene;
use crate::intersection::Intersection;
use crate::sphere::Sphere;


/*
 * Struct holding data about the current rendering process and provides the core rendering logic
 */
 #[derive(Copy, Clone)]
pub struct Renderer {
    pub eye_vector: Vector,
    pub view_right: Vector,
    pub view_up: Vector,
    pub pixel_width: f32,
    pub pixel_height: f32,
    pub half_width: f32,
    pub half_height: f32,
    pub camera_ray: Ray,
}

impl Renderer {

    pub fn create(scene: &Scene) -> Renderer {
        let eye_vector = Vector::unit_vector(Vector::sub(scene.camera.lookat, scene.camera.position));
        let view_right = Vector::unit_vector(Vector::cross(eye_vector, Vector::UP));
        let view_up = Vector::unit_vector(Vector::cross(view_right, eye_vector));
        
        let fov_radians: f32 = (std::f32::consts::PI * (scene.camera.fov / 2.0)) / 180.0;
        let height_width_ratio = scene.height / scene.width;
        let half_width: f32 = f32::tan(fov_radians);
        let half_height = height_width_ratio * half_width;
        let camera_width = half_width * 2.0;
        let camera_height = half_height * 2.0;
        let pixel_width = camera_width / (scene.width - 1.0);
        let pixel_height = camera_height / (scene.height - 1.0);

        let ray = Ray{
            origin: scene.camera.position,
            direction: Vector::ZERO
        };
        return Renderer {
            eye_vector: eye_vector,
            view_right: view_right,
            view_up: view_up,
            pixel_width: pixel_width,
            pixel_height: pixel_height,
            half_width: half_width,
            half_height: half_height,
            camera_ray: ray
        };
    }

    /*
     * Calculate the final color of the pixel at the given position
     */
    pub fn render_pixel(&mut self, scene: &Scene, x: usize, y: usize) -> Vector {
        self.camera_ray.direction = self.calc_camera_ray_direction(x, y);
        return self.trace(scene, self.camera_ray, 0);
    }

    /*
     * Calculate the direction of the ray for the pixel at the given position
     */
    fn calc_camera_ray_direction(self: &Self, x: usize, y: usize) -> Vector {
        let x_comp = Vector::scale(self.view_right, (x as f32) * self.pixel_width - self.half_width);
        let y_comp = Vector::scale(self.view_up, (y as f32) * self.pixel_height - self.half_height);
        return Vector::unit_vector(Vector::add3(self.eye_vector, x_comp, y_comp));
    }

    /*
     * Trace the ray(s) through the scene and return the resulting color 
     */
    fn trace(self: &Self, scene: &Scene, ray: Ray, depth: usize) -> Vector {
        if depth > scene.max_depth {
            return scene.sky_color;
        }
        let intersection = ray.intersect_scene(scene);
        if intersection.hit_sth {
            return self.surface(scene, ray, intersection, depth);
        } else {
            return scene.sky_color;
        }
    }


    /*
     * Calculate the color of the surface at the given intersection 
     */
    fn surface(self: &Self, scene: &Scene, ray: Ray, intersection: Intersection, depth: usize) -> Vector {
        let simpleShading: bool = false;
        
        let object: Sphere = intersection.object;
        let V: Vector = Vector::scale(ray.direction, -1.0);
        let N: Vector = intersection.normal;
        let L: Vector = Vector::unit_vector(Vector::sub(scene.lights[0], intersection.position));

        let mut light_visibility: f32 = 0.2;
        if self.is_light_visible(scene, intersection.position, L) {
            light_visibility = 1.0;
        }
        if simpleShading  {
            return object.material.shade_simple(light_visibility);
        } else {
            let reflection = self.get_reflection(scene, ray, intersection.position, intersection.normal, depth);
            return object.material.shade(V, N, L, Vector::scale(scene.light_color, light_visibility), reflection, Vector::scale(scene.sky_color, 0.1));
        }
    }


    /*
     * get the color of the reflection of the ray at the given position 
     */
    fn get_reflection(self: &Self, scene: &Scene, ray: Ray, position: Vector, normal: Vector, depth: usize) -> Vector {
        let reflected_ray = ray.reflect(position, normal);
        return self.trace(scene, reflected_ray, depth+1);
    }

    /*
     * Check whether the light is visible from the given position
     */
    fn is_light_visible(self: &Self, scene: &Scene, position: Vector, light_direction: Vector) -> bool {
        let shadow_ray = Ray { origin: position, direction: Vector::scale(light_direction, -1.0)};
        let intersection = shadow_ray.intersect_scene(scene);
        return intersection.distance > -0.005;
    }


}