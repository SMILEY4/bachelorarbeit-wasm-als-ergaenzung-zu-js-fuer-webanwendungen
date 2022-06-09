import {setup, runBinaryHeap} from "./binaryheap.js"
import {Benchmark} from "./benchmark.js";

const SEED = 123;
const N1 = 2_000_000;
const N2 = 1_000_000;


Module.onRuntimeInitialized = function() {
	const benchmark = new Benchmark("Binary Heap", "C++");
	benchmark.onSetup(() => {
		setup()
	})
	benchmark.onRun(() => {
		runBinaryHeap(N1, N2, SEED);
	});
	benchmark.runBenchmark(4);
}