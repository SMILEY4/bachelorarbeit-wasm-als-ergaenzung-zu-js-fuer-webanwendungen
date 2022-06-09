#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>

std::string concat(std::string a, std::string b) { 
	EM_ASM({
		// ausgeben der gegebenen Strings in der Konsole mit eingebettetem JavaScript-Code
		console.log("concat " + UTF8ToString($0) + " and " + UTF8ToString($1))
	}, const_cast<char*>(a.c_str()), const_cast<char*>(b.c_str()));
	// Zusammenfügen und Zurückgeben der Strings
	return a + " " + b;
}

EMSCRIPTEN_BINDINGS(myModule) {
	// exportieren der "concat"-Funktion mit "embind"
	emscripten::function("concat", &concat);
}