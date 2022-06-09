import loader from "https://cdn.jsdelivr.net/npm/@assemblyscript/loader/index.js";

// Dateipfade zu den .wasm-Dateien
const PATH_WASM_DEBUG = "./build/debug.wasm";
const PATH_WASM_RELEASE = "./build/release.wasm";

// Referenz auf die WebAssembly-Instanz
let wasm = null;

// Objekt mit der zu importierender Funktion "console.log"
const importObject = {
	"index": { "console.log": (arg) => console.log(wasm.__getString(arg)) }
}

// Laden und Instanziieren des Wasm-Moduls mit dem "AssemblyScript-Loader"
loader.instantiate(fetch(PATH_WASM_RELEASE), importObject)
	.then(({exports}) => { wasm = exports })
	.then(() => {
		// Erstellen von zwei Zeigern auf neue Strings
		const ptrA = wasm.__newString("Hello")
		const ptrB = wasm.__newString("World")
		// Aufrufen der AssemblyScript-Funktion 
		const ptrResult = wasm.concat(ptrA, ptrB);
		// Ausgeben und Konvertieren des zurückgegebenen Zeigers in einen String
		console.log(wasm.__getString(ptrResult));
	})