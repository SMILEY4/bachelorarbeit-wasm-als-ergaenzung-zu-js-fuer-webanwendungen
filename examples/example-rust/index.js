import init, { concat } from "./pkg/example_rust.js"

// Laden und Instanziieren des Wasm-Moduls
init().then(() => {
	// Aufrufen der Rust-Funktion
	const result = concat("Hello", "World");
	// Ausgeben des Ergebnisses
	console.log(result);
})