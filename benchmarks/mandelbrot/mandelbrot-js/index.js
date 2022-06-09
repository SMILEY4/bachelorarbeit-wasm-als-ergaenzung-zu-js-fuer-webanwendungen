import {setup, renderMandelbrot} from "./mandelbrot.js";
import {Benchmark} from "./benchmark.js"

const WIDTH = 3000;
const HEIGHT = 3000;
const MAX_ITERATIONS = 200;


const benchmark = new Benchmark("Mandelbrot-Menge", "JavaScript");
benchmark.onSetup(() => {
	setup(WIDTH, HEIGHT);
})
benchmark.onRun(() => {
	renderMandelbrot(WIDTH, HEIGHT, MAX_ITERATIONS, "canvas");
});
benchmark.runBenchmark(4);