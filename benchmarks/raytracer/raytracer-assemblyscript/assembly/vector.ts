
/*
 * Class holding data about a 3d-Vector and provides functions for operating on vectors
 */
export class Vector {

	static UP: Vector = new Vector(0,-1,0);
	static ZERO: Vector = new Vector(0,0,0);
	static WHITE: Vector = new Vector(1,1,1);


	constructor(
		public x: f32,
		public y: f32,
		public z: f32
	) {} 


	static dot(a: Vector, b: Vector): f32 {
		return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
	}


	static cross(a: Vector, b: Vector): Vector {
		return new Vector(
			(a.y * b.z) - (a.z * b.y),
			(a.z * b.x) - (a.x * b.z),
			(a.x * b.y) - (a.y * b.x)
		);
	}


	static scale(a: Vector, t: f32): Vector {
		return new Vector(
			a.x * t,
			a.y * t,
			a.z * t
		);
	}


	static length(a: Vector): f32 {
		return Mathf.sqrt(Vector.dot(a, a));
	}


	static unitVector(a: Vector): Vector {
		return Vector.scale(a, 1.0 / Vector.length(a));
	}


	static add(a: Vector, b: Vector): Vector {
		return new Vector(
			a.x + b.x,
			a.y + b.y,
			a.z + b.z
		);
	}


	static add3(a: Vector, b: Vector, c: Vector): Vector {
		return new Vector(
			a.x + b.x + c.x,
			a.y + b.y + c.y,
			a.z + b.z + c.z
		);
	}


	static sub(a: Vector, b: Vector): Vector {
		return new Vector(
			a.x - b.x,
			a.y - b.y,
			a.z - b.z
		);
	}

	static mul(a: Vector, b: Vector): Vector {
		return new Vector(
			a.x * b.x,
			a.y * b.y,
			a.z * b.z
		);
	}

	static mix(a: Vector, b: Vector, t: f32): Vector {
		return new Vector(
			a.x * (1 - t) + b.x * t,
			a.y * (1 - t) + b.y * t,
			a.z * (1 - t) + b.z * t
		);
	}


	static reflectThrough(a: Vector, normal: Vector): Vector {
		const d = Vector.scale(normal, Vector.dot(a, normal));
		return Vector.sub(Vector.scale(d, 2), a);
	}

}