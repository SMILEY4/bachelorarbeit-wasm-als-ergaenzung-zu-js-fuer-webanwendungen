#[derive(Copy, Clone)]
pub struct Vector {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}



impl Vector {

    pub const UP: Vector = Vector {x: 0.0, y: -1.0, z: 0.0};
    pub const ZERO: Vector = Vector {x: 0.0, y: 0.0, z: 0.0};
    pub const WHITE: Vector = Vector {x: 1.0, y: 1.0, z: 1.0};


    pub fn dot(a: Vector, b: Vector) -> f32 {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    pub fn cross(a: Vector, b: Vector) -> Vector {
        return Vector {
            x: (a.y * b.z) - (a.z * b.y),
            y: (a.z * b.x) - (a.x * b.z),
            z: (a.x * b.y) - (a.y * b.x)
        };
    }

    pub fn scale(a: Vector, t: f32) -> Vector {
        return Vector {
            x: a.x * t,
            y: a.y * t,
            z: a.z * t
        };
    }

    pub fn length(a: Vector) -> f32 {
        return f32::sqrt(Vector::dot(a, a));
    }

    pub fn unit_vector(a: Vector) -> Vector {
        return Vector::scale(a, 1.0 / Vector::length(a));
    }

    pub fn add(a: Vector, b: Vector) -> Vector {
        return Vector {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z
        };
    }

    pub fn add3(a: Vector, b: Vector, c: Vector) -> Vector {
        return Vector {
            x: a.x + b.x + c.x,
            y: a.y + b.y + c.y,
            z: a.z + b.z + c.z
        };
    }

    pub fn sub(a: Vector, b: Vector) -> Vector {
        return Vector {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        };
    }

    pub fn mul(a: Vector, b: Vector) -> Vector {
        return Vector {
            x: a.x * b.x,
            y: a.y * b.y,
            z: a.z * b.z
        };
    }

    pub fn reflect_through(a: Vector, normal: Vector) -> Vector {
        let d = Vector::scale(normal, Vector::dot(a, normal));
        return Vector::sub(Vector::scale(d, 2.0), a);
    }

    pub fn mix(a: Vector, b: Vector, t: f32) -> Vector {
        return Vector {
            x: a.x * (1.0 - t) + b.x * t,
            y: a.y * (1.0 - t) + b.y * t,
            z: a.z * (1.0 - t) + b.z * t,
        };
    }

}