import loader from "https://cdn.jsdelivr.net/npm/@assemblyscript/loader/index.js";


const WASM_PATH_RELEASE = "./build/release.wasm"
const WASM_PATH_RELEASE_NO_OPTIMIZE = "./build/releaseNoOptimize.wasm"


let amountBytes = null;
let amountPages = null;
let memory = null;
let wasm = null;

// load and prepare wasm-instance (ASYNC)
export async function setup(width, height) {

	amountBytes = width * height * 4;
	amountPages = ((amountBytes + 0xffff) & ~0xffff) >>> 16;
	memory = new WebAssembly.Memory({ initial: amountPages });

	const importObj = {
		index: {},
		env: { memory }
	}

	await loader.instantiate(fetch(WASM_PATH_RELEASE_NO_OPTIMIZE), importObj)
		.then(({exports}) => { wasm = exports; })
}


// renders the mandelbrot with the given size and max. number of iterations to the canvas with the given id
export function renderMandelbrot(width, height, maxIterations, canvasId) {

	const canvas = document.getElementById(canvasId);
	const context = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;

	wasm.calculateMandelbrotInMemory(width, height, maxIterations);
	const buffer = new Uint8Array(wasm.memory.buffer, 0, width*height*4);

	const imageData = context.createImageData(width, height);
	imageData.data.set(buffer);
	context.putImageData(imageData, 0, 0);
}

