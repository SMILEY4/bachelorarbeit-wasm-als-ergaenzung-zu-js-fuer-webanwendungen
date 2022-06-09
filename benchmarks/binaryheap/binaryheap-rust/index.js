import init, {run_binaryheap} from "./pkg/binaryheap_rust.js";
import {Benchmark} from "./benchmark.js";


const benchmark = new Benchmark("Binary Heap", "Rust");
benchmark.onSetup(() => {
	return init()
})
benchmark.onRun(() => {
	run_binaryheap();
});
benchmark.runBenchmark(4);
