
let api = null;
let context = null;
let ptrBuffer = null;

export function setup(width, height) {
	
	api = {
		renderMandelbrot: Module.cwrap('renderMandelbrot', null, ['number', 'number', 'number', 'number']),
		destroyBuffer: Module.cwrap('destroyBuffer', null, ['number']),
		createBuffer: Module.cwrap('createBuffer', 'number', ['number', 'number'])
	};

	const canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext("2d");

	ptrBuffer = api.createBuffer(width, height);
}


export function renderMandelbrot(width, height, maxIterations) {
	api.renderMandelbrot(ptrBuffer, width, height, maxIterations);
	const pixels = new Uint8Array(Module.HEAP8.buffer, ptrBuffer, width*height*4);
	const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
	context.putImageData(imageData, 0, 0);
}


export function cleanup() {
	api.destroyBuffer(ptrBuffer)
}