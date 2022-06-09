import {setup, render, getUsedMemory, runGC} from "./raytracer.js";
import {Benchmark} from "./benchmark.js";

const WIDTH = 1000;
const HEIGHT = 1000;


const benchmark = new Benchmark("Raytracer", "AssemblyScript (optimiert)");
benchmark.onSetup(() => {
	return setup(WIDTH, HEIGHT);
})
benchmark.onRun(() => {
	render(WIDTH, HEIGHT, "canvas")
});
benchmark.runBenchmark(4);