# Beispielanwendung Emscripten (C++) 

Eine einfache Beispielanwendung zum demonstrieren der Basisfunktionalitäten von Emscripten mit C++.

### Ausführen

1. "emscripten" installiert (https://emscripten.org/docs/getting_started/downloads.html)

2. C++-Code kompilieren mit
   - `emcc ./src/example.cpp -o ./dst/example.js --bind`
   - Alternativ `make`; Programm "Make" muss dafür installiert sein

3. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)

   

### Inhalt

- *index.html* - HTML-Code der Seite, lädt *index.js* und die von Emscripten generierte JS-Datei
- *index.js* - ruft von Wasm-Instanz exportierte Funktionen auf
- *./src/example.cpp* - C++-Code, der dann in Wasm kompiliert wird
- *./dst/* - die beim Kompilieren generierten Dateien