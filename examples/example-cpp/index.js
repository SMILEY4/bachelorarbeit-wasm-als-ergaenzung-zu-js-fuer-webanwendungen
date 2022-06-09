// Warten auf Initialisierung des Moduls
Module.onRuntimeInitialized = function() {
	// Aufrufen der C++-Funktion
	const result = Module.concat("Hello", "World");
	// Ausgeben des Ergebnisses
	console.log(result)
}