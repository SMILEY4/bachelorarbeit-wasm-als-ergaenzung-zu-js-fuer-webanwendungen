import init, {setup, render} from "./pkg/raytracer_rust.js";
import {Benchmark} from "./benchmark.js";

const benchmark = new Benchmark("Raytracer", "Rust");
benchmark.onSetup(() => {
	return init()
		.then(() => setup())
})
benchmark.onRun(() => {
	render();
});
benchmark.runBenchmark(4);