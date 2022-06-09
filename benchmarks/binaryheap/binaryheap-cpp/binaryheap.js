
let api = null;

export function setup() {
	api = {
		calculateBinayHeap: Module.cwrap('calculateBinayHeap', null, ['number', 'number', 'number']),
	};
}

export function runBinaryHeap(n1, n2, seed) {
	api.calculateBinayHeap(n1, n2, seed);
}
