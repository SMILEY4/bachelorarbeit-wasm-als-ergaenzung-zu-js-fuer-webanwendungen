import {setup, cleanup, render, getUsedMemory} from "./raytracer.js"
import {Benchmark} from "./benchmark.js";

const WIDTH = 100;
const HEIGHT = 100;
const MAX_DEPTH = 5;


Module.onRuntimeInitialized = function() {

	const benchmark = new Benchmark("Raytracer", "C++");
	benchmark.onSetup(() => {
		setup(WIDTH, HEIGHT, MAX_DEPTH)
	})
	benchmark.onRun(() => {
		render(WIDTH, HEIGHT);
	});
	benchmark.onDone(() => {
		cleanup();
	})
	benchmark.runBenchmark(4);

}
