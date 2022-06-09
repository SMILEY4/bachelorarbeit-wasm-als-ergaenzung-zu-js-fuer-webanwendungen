import {setup, renderMandelbrot} from "./mandelbrot.js";
import {Benchmark} from "./benchmark.js";

const WIDTH = 2000;
const HEIGHT = 2000;
const MAX_ITERATIONS = 100;


window.onload = function() {
	const benchmark = new Benchmark("Mandelbrot-Menge", "AssemblyScript");
	benchmark.onSetup(() => {
		return setup(WIDTH, HEIGHT);
	})
	benchmark.onRun(() => {
		renderMandelbrot(WIDTH, HEIGHT, MAX_ITERATIONS, "canvas");
	});
	benchmark.runBenchmark(4);
}