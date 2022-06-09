export class Benchmark {

	constructor(name, language) {
		this.funSetup = null;
		this.funRun = null;
		this.funDone = null;
		this.name = name;
		this.language = language;
		this.measurementsTime = null;
		this.startTime = null;
	}

	onSetup(fun) {
		this.funSetup = fun;
	}

	onRun(fun) {
		this.funRun = fun;
	}

	onDone(fun) {
		this.funDone = fun;
	}

	runBenchmark(amountRuns) {
		this.prepareBenchmark(amountRuns);
		return Promise.resolve(this.funSetup())
			.then(() => {
				for(let i=0; i<amountRuns; i++) {
					this.beforeRun();
					this.funRun();
					this.afterRun(i);
				}
				this.onDone && this.onDone();
			})
			.then(() => {
				this.printResults();
				alert("Done!");
			})
	}

	prepareBenchmark(amountRuns) {
		this.measurementsTime = Array.apply(null, Array(amountRuns)).map(function () {});
	}

	beforeRun() {
		this.startTime = performance.now();
	}

	afterRun(index) {
		const time = performance.now() - this.startTime;
		this.measurementsTime[index] = time;
	}

	printResults() {
		console.log("====== " + this.name + " ======");
		console.log("Language = " + this.language);
		console.log("UserAgent = " + navigator.userAgent);
		console.log("Runtime =", JSON.stringify(this.measurementsTime));
	}

}