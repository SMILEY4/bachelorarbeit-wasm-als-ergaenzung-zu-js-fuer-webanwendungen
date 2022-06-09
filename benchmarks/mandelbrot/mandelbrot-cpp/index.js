import {setup, cleanup, renderMandelbrot} from "./mandelbrot.js"
import {Benchmark} from "./benchmark.js";

const WIDTH = 3000;
const HEIGHT = 3000;
const MAX_ITERATIONS = 200;


Module.onRuntimeInitialized = function() {

	const benchmark = new Benchmark("Mandelbrot-Menge", "C++");
	benchmark.onSetup(() => {
		setup(WIDTH, HEIGHT)
	})
	benchmark.onRun(() => {
		renderMandelbrot(WIDTH, HEIGHT, MAX_ITERATIONS);
	});
	benchmark.onDone(() => {
		cleanup();
	})
	benchmark.runBenchmark(4);

}
