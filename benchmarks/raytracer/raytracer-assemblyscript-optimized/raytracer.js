import loader from "https://cdn.jsdelivr.net/npm/@assemblyscript/loader/index.js";

const WASM_PATH_DEBUG = "./build/debug.wasm";
const WASM_PATH_RELEASE = "./build/release.wasm";
const WASM_PATH_RELEASE_NO_RUNTIME = "./build/releaseNoRT.wasm";
const WASM_PATH_RELEASE_OPTIMIZED = "./build/releaseOptimized.wasm";
const WASM_PATH_RELEASE_NO_RUNTIME_OPTIMIZED = "./build/releaseNoRTOptimized.wasm";

let memory = null;
let wasm = null;

export async function setup(width, height) {
	
	memory = new WebAssembly.Memory({
		initial:  Math.floor(width * height * 4 / 65536) + 1
	});

	const importObj = {
		index: {},
		env: {
			memory: memory,
			abort: (msg, file, line, col) => console.error(msg, file, line, col)
		}
	}

	await loader.instantiate(fetch(WASM_PATH_RELEASE_NO_RUNTIME), importObj)
		.then(({exports}) => { wasm = exports; })
		.then(() => wasm.setup())
}



export function render(width, height, canvasId) {

	const canvas = document.getElementById(canvasId);
	const context = canvas.getContext("2d");
	canvas.width = width;
	canvas.height = height;

	wasm.render();
	const offset = wasm.getDataBuffer();
	const buffer = new Uint8Array(memory.buffer, offset, width*height*4);

	const imageData = context.createImageData(width, height);
	imageData.data.set(buffer);
	context.putImageData(imageData, 0, 0);
}

export function getUsedMemory() {
	return wasm.memory.buffer.byteLength;
}

export function runGC() {
	wasm.__collect && wasm.__collect();
}

