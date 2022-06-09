import {setup, runBinaryHeap} from "./binaryHeap.js";
import {Benchmark} from "./benchmark.js";

// The seed for the RNG
const SEED = 123;
// The amount of values to add
const N1 = 2_000_000;
// The amount of values to remove
const N2 = 1_000_000;


const benchmark = new Benchmark("Binary Heap", "AssemblyScript");
benchmark.onSetup(() => {
	return setup();
})
benchmark.onRun(() => {
	runBinaryHeap(SEED, N1, N2);
});
benchmark.runBenchmark(4);