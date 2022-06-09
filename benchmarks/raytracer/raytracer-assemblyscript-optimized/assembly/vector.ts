
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



	set(a: Vector): Vector {
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
		return this;
	}

	setXYZ(x: f32, y: f32, z: f32): Vector {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}


	add(a: Vector): Vector {
		this.x = this.x + a.x;
		this.y = this.y + a.y;
		this.z = this.z + a.z;
		return this;
	}


	sub(a: Vector): Vector {
		this.x = this.x - a.x;
		this.y = this.y - a.y;
		this.z = this.z - a.z;
		return this;
	}


	mul(a: Vector): Vector {
		this.x = this.x * a.x;
		this.y = this.y * a.y;
		this.z = this.z * a.z;
		return this;
	}


	scale(t: f32): Vector {
		this.x = this.x * t;
		this.y = this.y * t;
		this.z = this.z * t;
		return this;
	}


	length(): f32 {
		return Vector.length(this);
	}


	normalize(): Vector {
		this.scale(1.0 / this.length());
		return this;
	}


	mix(a: Vector, t: f32): Vector {
		this.x = this.x * (1 - t) + a.x * t,
		this.y = this.y * (1 - t) + a.y * t,
		this.z = this.z * (1 - t) + a.z * t
		return this;
	}


	reflect(normal: Vector): Vector {
		const d = normal.copy().scale(Vector.dot(this, normal))
		const r = d.scale(2).sub(this);
		return this.set(r);
	}


	copy(): Vector {
		return new Vector(this.x, this.y, this.z);
	}
	

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


	static tmpRefl: Vector = Vector.ZERO.copy();

	static reflectThrough(a: Vector, normal: Vector): Vector {
		const d = this.tmpRefl.set(normal).scale(Vector.dot(a, normal));
		return d.scale(2).sub(a).copy();
	}

}