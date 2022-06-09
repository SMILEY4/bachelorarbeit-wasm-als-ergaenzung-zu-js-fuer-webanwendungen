use crate::vector::Vector;
use crate::sphere::Sphere;
use crate::camera::Camera;
use crate::material::Material;
use crate::random::RANDOM_VALUES;

pub struct Scene {
        // the width of the image
        pub width: f32,
        // the height of the image
        pub height: f32,
        // defines the max amount of bounces/reflections (0 = no reflections)
        pub max_depth: usize,
        // the camera
        pub camera: Camera,
        // the color of the "sky"
        pub sky_color: Vector,
        // the color of the lights
        pub light_color: Vector,
        // the position of the lights
        pub lights: Vec<Vector>,
        // the objects in the scene
        pub objects: Vec<Sphere>
}

impl Scene {

    pub fn create_default(width: f32, height: f32, max_depth: usize) -> Scene {
        let mut scene = Scene {
            width: width,
            height: height,
            max_depth: max_depth,
            camera: Camera {
                position: Vector {x: -10.0, y: 14.0, z: 20.0},
                lookat: Vector {x: 0.0, y: 0.0, z: 0.0},
                fov: 60.0
            },
            sky_color: Vector {x: 1.0, y: 1.0, z: 1.0},
            light_color: Vector {x: 1.5, y: 1.5, z: 1.5},
            lights: vec![
                Vector {x: 0.0, y: 10.0, z: 20.0}
            ],
            objects: vec![
                Sphere {
                    center: Vector {x: 0.0, y: 7.0, z: -8.0},
                    radius: 3.0,
                    material: Material {
                        metalness: 1.0,
                        roughness: 0.0,
                        base_color: Vector {x: 1.0, y: 0.4, z: 0.4}
                    }
                },
                Sphere {
                    center: Vector {x: 0.0, y: -30.0, z: -8.0},
                    radius: 30.0,
                    material: Material {
                        metalness: 0.0,
                        roughness: 0.1,
                        base_color: Vector {x: 0.9, y: 0.9, z: 0.9}
                    }
                }
            ]
        };
        let mut index_random = 0;
        for _i in 0..30 {
            scene.objects.push(Sphere {
                center: Vector {
                    x: RANDOM_VALUES[index_random+0] * 25.0 - 12.0,
                    y: RANDOM_VALUES[index_random+1] * 20.0 - 10.0,
                    z: RANDOM_VALUES[index_random+2] * 25.0 - 12.0,
                },
                radius: RANDOM_VALUES[index_random+3] * 2.0 + 0.4,
                material: Material {
                    metalness: if RANDOM_VALUES[index_random+4] < 0.5 { 0.0 } else { 1.0 },
                    roughness: RANDOM_VALUES[index_random+5],
                    base_color: Vector {
                        x: RANDOM_VALUES[index_random+6] * 0.7 + 0.3,
                        y: RANDOM_VALUES[index_random+7] * 0.7 + 0.3,
                        z: RANDOM_VALUES[index_random+8] * 0.7 + 0.3
                    }
                }
            });
            index_random = index_random+9;
        }
        for _i in 0..10 {
            scene.objects.push(Sphere {
                center: Vector {
                    x: RANDOM_VALUES[index_random+0] * 14.0 - 7.0,
                    y: 0.0,
                    z: RANDOM_VALUES[index_random+1] * 14.0 - 7.0,
                },
                radius: RANDOM_VALUES[index_random+2] * 2.0 + 0.4,
                material: Material {
                    metalness: if RANDOM_VALUES[index_random+3] < 0.5 { 0.0 } else { 1.0 },
                    roughness: RANDOM_VALUES[index_random+4],
                    base_color: Vector {
                        x: RANDOM_VALUES[index_random+5] * 0.7 + 0.3,
                        y: RANDOM_VALUES[index_random+6] * 0.7 + 0.3,
                        z: RANDOM_VALUES[index_random+7] * 0.7 + 0.3
                    }
                }
            });
            index_random = index_random+8;
        }
        return scene;
    }

    pub fn copy(&self) -> Scene {
        let copied_scene = Scene {
            width: self.width,
            height: self.height,
            max_depth: self.max_depth,
            camera: self.camera,
            sky_color: self.sky_color,
            light_color: self.light_color,
            lights: self.lights.clone(),
            objects: self.objects.clone()
        };
        return copied_scene;
    }

}