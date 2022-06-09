import loader from "https://cdn.jsdelivr.net/npm/@assemblyscript/loader/index.js";

const WASM_PATH_DEBUG = "./build/untouched.wasm"
const WASM_PATH_RELEASE = "./build/release.wasm"
const WASM_PATH_RELEASE_NO_OPTIMIZE = "./build/releaseNoOptimize.wasm"

let wasm = null;

// load and prepare wasm-instance
export async function setup() {
	await loader.instantiate(fetch(WASM_PATH_RELEASE), {})
		.then(({exports}) => { wasm = exports; })
}

// run the test-function
export function runBinaryHeap(seed, N1, N2) {
	wasm.runBinaryHeap(seed, N1, N2);
}

