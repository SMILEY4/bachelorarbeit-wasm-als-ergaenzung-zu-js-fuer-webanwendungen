import init, {render} from "./pkg/mandelbrot_rust.js";


init().then(() => {
	console.log(measure(10))
})



function measure(n) {
	const measurements = Array.apply(null, Array(n)).map(function () {})
	for(let i=0; i<n; i++) {
		const t1 = Date.now();
		render();
		const t2 = Date.now();
		measurements[i] = t2-t1
	}
	return measurements;
}