import {setup, render} from "./src/raytracer.js";
import {Benchmark} from "./benchmark.js";

const WIDTH = 100;
const HEIGHT = 100;
const MAX_DEPTH = 5


const benchmark = new Benchmark("Raytracer", "JavaScript");
benchmark.onSetup(() => {
	setup(WIDTH, HEIGHT, MAX_DEPTH, "canvas");
})

benchmark.onRun(() => {
	render();
});
benchmark.runBenchmark(4);
