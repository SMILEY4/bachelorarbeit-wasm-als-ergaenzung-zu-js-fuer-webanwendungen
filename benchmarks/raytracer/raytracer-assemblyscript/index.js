import {setup, render, getUsedMemory} from "./raytracer.js";
import {Benchmark} from "./benchmark.js";

const WIDTH = 100;
const HEIGHT = 100;


const benchmark = new Benchmark("Raytracer", "AssemblyScript");
benchmark.onSetup(() => {
	return setup(WIDTH, HEIGHT);
})
benchmark.onRun(() => {
	render(WIDTH, HEIGHT, "canvas")
});
benchmark.runBenchmark(4);
