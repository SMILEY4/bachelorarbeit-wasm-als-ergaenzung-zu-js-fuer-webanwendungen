# Beispielanwendung Rust 

Eine einfache Beispielanwendung zum demonstrieren der Basisfunktionalitäten von Rust.

### Ausführen

1. "Rust" installiert (https://www.rust-lang.org/tools/install)
2. "wasm-pack" installiert (https://rustwasm.github.io/wasm-pack/installer/)
2. Rust-Code kompilieren mit
   - `wasm-pack build --target web`
3. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)




### Inhalt

- *index.html* - HTML-Code der Seite, lädt *index.js*
- *index.js* - Einstiegspunkt der Anwendung, Instanziert Wasm-Modul und ruft von Wasm-Instanz exportierte Funktionen auf
- *./src/lib.rs* - Rust-Code, der dann in Wasm kompiliert wird
- *./pkg/* - die beim Kompilieren generierten Dateien

