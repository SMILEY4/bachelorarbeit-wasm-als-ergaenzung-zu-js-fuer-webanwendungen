
export class Vector {

	static ZERO = new Vector(0,0,0);
	static UP = new Vector(0,-1,0);
	static WHITE = new Vector(-1,-1,-1);


	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static dot(a, b) {
		return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
	}


	static cross(a, b) {
		return new Vector(
			(a.y * b.z) - (a.z * b.y),
			(a.z * b.x) - (a.x * b.z),
			(a.x * b.y) - (a.y * b.x)
		);
	}


	static scale(a, t) {
		return new Vector(
			a.x * t,
			a.y * t,
			a.z * t
		);
	}


	static length(a) {
		return Math.sqrt(Vector.dot(a, a));
	}


	static unitVector(a) {
		return Vector.scale(a, 1.0 / Vector.length(a));
	}


	static add(a, b) {
		return new Vector(
			a.x + b.x,
			a.y + b.y,
			a.z + b.z
		);
	}


	static add3(a, b, c) {
		return new Vector(
			a.x + b.x + c.x,
			a.y + b.y + c.y,
			a.z + b.z + c.z
		);
	}


	static sub(a, b) {
		return new Vector(
			a.x - b.x,
			a.y - b.y,
			a.z - b.z
		);
	}

	static mul(a, b) {
		return new Vector(
			a.x * b.x,
			a.y * b.y,
			a.z * b.z
		);
	}

	static mix(a, b, t) {
		return new Vector(
			a.x * (1 - t) + b.x * t,
			a.y * (1 - t) + b.y * t,
			a.z * (1 - t) + b.z * t
		);
	}


	static reflectThrough(a, normal) {
		const d = Vector.scale(normal, Vector.dot(a, normal));
		return Vector.sub(Vector.scale(d, 2), a);
	}


}