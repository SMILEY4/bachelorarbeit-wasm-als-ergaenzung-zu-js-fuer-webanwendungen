
export function calculateMandelbrotInMemory(width: i32, height: i32, maxIterations: i32): void {

	const maxIterationsFloat: f32 = maxIterations as f32;
	const widthFloat: f32 = width as f32;
	const heightFloat: f32 = height as f32;

	for (let py: i32 = 0; py < height; py++) {
		for (let px: i32 = 0; px < width; px++) {

			const x0: f32 = scaleCoordinate(px as f32, widthFloat, -2.00, 0.47);
			const y0: f32 = scaleCoordinate(py as f32, heightFloat, -1.12, 1.12);

			let x: f32 = 0;
			let y: f32 = 0;
			let iteration: i32 = 0;

			while ((x * x + y * y <= 2 * 2) && (iteration < maxIterations)) {
				const xTemp: f32 = x * x - y * y + x0;
				y = 2.0 * x * y + y0;
				x = xTemp;
				iteration++;
			}

			const index: usize = (px + py * height) * 4;

			if (iteration === maxIterations) {
				unchecked(store<u16>(index + 0, 0)) ;
				unchecked(store<u16>(index + 1, 0)) ;
				unchecked(store<u16>(index + 2, 0)) ;
				unchecked(store<u16>(index + 3, 255)) ;
			} else {
				const pIter = (iteration as f32) / maxIterationsFloat;
				unchecked(store<u16>(index + 0, getRed(pIter, 1.0, 0.5)));
				unchecked(store<u16>(index + 1, getGreen(pIter, 1.0, 0.5)));
				unchecked(store<u16>(index + 2, getBlue(pIter, 1.0, 0.5)));
				unchecked(store<u16>(index + 3, 255));
			}
		}
	}
}

function getRed(h: f32, s: f32, l: f32): u16 {
	const q: f32 = getQ(h, s, l);
	const p: f32 = getP(q, l);
	const value: f32 = hue2rgb(p, q, h + 1.0 / 3.0);
	return Mathf.round(value * 255) as u16;
}

function getGreen(h: f32, s: f32, l: f32): u16 {
	const q: f32 = getQ(h, s, l);
	const p: f32 = getP(q, l);
	const value: f32 = hue2rgb(p, q, h);
	return Mathf.round(value * 255) as u16;
}

function getBlue(h: f32, s: f32, l: f32): u16 {
	const q: f32 = getQ(h, s, l);
	const p: f32 = getP(q, l);
	const value: f32 = hue2rgb(p, q, h - 1.0 / 3.0);
	return Mathf.round(value * 255) as u16;
}

@inline
function getQ(h: f32, s: f32, l: f32): f32 {
	return l < 0.5 ? l * (1.0 + s) : l + s - l * s;
}

@inline
function getP(q: f32, l: f32): f32 {
	return 2.0 * l - q;
}

@inline
function scaleCoordinate(input: f32, maxInputValue: f32, minOutput: f32, maxOutput: f32): f32 {
	return (input / maxInputValue) * (maxOutput - minOutput) + minOutput;
}

function hue2rgb(p: f32, q: f32, t: f32): f32 {
	if (t < 0) {
		t += 1;
	}
	if (t > 1) {
		t -= 1;
	}
	if (t < 1 / 6) {
		return p + (q - p) * 6 * t;
	}
	if (t < 1 / 2) {
		return q;
	}
	if (t < 2 / 3) {
		return p + (q - p) * (2 / 3 - t) * 6;
	}
	return p;
}