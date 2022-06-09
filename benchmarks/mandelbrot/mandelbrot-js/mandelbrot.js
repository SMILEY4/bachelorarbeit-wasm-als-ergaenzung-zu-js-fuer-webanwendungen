
let pixelData = null;

export function setup(width, height) {
	pixelData = new Uint8ClampedArray(width * height * 4);
}

// renders the mandelbrot with the given size and max. number of iterations to the canvas with the given id
export function renderMandelbrot(width, height, maxIterations, canvasId) {

	const canvas = document.getElementById(canvasId);
	const context = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;

	calculateMandelbrot(width, height, maxIterations);
	context.putImageData(new ImageData(pixelData, width, height), 0, 0);
}


// calculate the mandelbrot and return the result as an 'Uint8ClampedArray' containing the rgba-bytes
function calculateMandelbrot(width, height, maxIterations) {
	for (let px = 0; px < width; px++) {
		for (let py = 0; py < height; py++) {
			const x0 = scaleCoordinate(px, width, -2.00, 0.47)
			const y0 = scaleCoordinate(py, height, -1.12, 1.12)
			let x = 0;
			let y = 0;
			let iteration = 0;
			while ((x * x + y * y <= 2 * 2) && (iteration < maxIterations)) {
				const xTemp = x * x - y * y + x0;
				y = 2 * x * y + y0;
				x = xTemp;
				iteration++;
			}
			const rgba = getColorRgba(iteration, maxIterations);
			const index = px + py * height
			pixelData[index * 4 + 0] = rgba[0]
			pixelData[index * 4 + 1] = rgba[1]
			pixelData[index * 4 + 2] = rgba[2]
			pixelData[index * 4 + 3] = 255
		}
	}
}


// scale the input coordinate value with the given max. value to the given range
function scaleCoordinate(input, maxInputValue, minOutput, maxOutput) {
	return (input / maxInputValue) * (maxOutput - minOutput) + minOutput;
}


// calculate a color for the given amount of iterations, returns an array with 4 values for rgba
function getColorRgba(iteration, maxIterations) {
	if (iteration === maxIterations) {
		return [0, 0, 0]
	} else {
		return hslToRgba(iteration / maxIterations, 1.0, 0.5)
	}
}


// convert from hsl to rgba
function hslToRgba(h, s, l) {
	let r, g, b;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p, q, t) => {
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
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
