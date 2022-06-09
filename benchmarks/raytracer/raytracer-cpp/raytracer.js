
let api = null;
let context = null;
let ptrBuffer = null;


export function setup(width, height, maxDepth) {
	api = {
		render: Module.cwrap('render', null, ['number']),
		destroyBuffer: Module.cwrap('destroyBuffer', null, ['number']),
		createBuffer: Module.cwrap('createBuffer', 'number', ['number', 'number']),
		setup: Module.cwrap('setup', null, ['number', 'number', 'number'])
	};

	const canvas = document.getElementById("canvas");
	canvas.width = width;
	canvas.height = height;
	context = canvas.getContext("2d");

	ptrBuffer = api.createBuffer(width, height);
	api.setup(width, height, maxDepth);
}

export function cleanup() {
	api.destroyBuffer(ptrBuffer)
}

export function render(width, height) {
	api.render(ptrBuffer);
	const pixels = new Uint8Array(Module.HEAP8.buffer, ptrBuffer, width*height*4);
	const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);
	context.putImageData(imageData, 0, 0);
}

export function getUsedMemory() {
	return Module.HEAP8.buffer.byteLength;
}