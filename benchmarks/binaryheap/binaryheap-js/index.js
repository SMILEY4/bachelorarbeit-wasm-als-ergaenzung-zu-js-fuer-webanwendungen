import {runBinaryHeap} from "./binaryHeap.js";
import {Benchmark} from "./benchmark.js"

const SEED = 123;
const N1 = 2_000_000;
const N2 = 1_000_000;


const benchmark = new Benchmark("Binary Heap", "JavaScript");
benchmark.onSetup(() => {})
benchmark.onRun(() => {
	runBinaryHeap(SEED, N1, N2);
});
benchmark.runBenchmark(4);
