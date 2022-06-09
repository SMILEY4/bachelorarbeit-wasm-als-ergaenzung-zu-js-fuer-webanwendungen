# Mandelbrot Rust

Berechnet und zeigt eine Mandelbrot-Menge an.
- Mandelbrot-Menge wird im Canvas der angegebenen Größe angezeigt
  - Größe in "/src/lib.rs" `WIDTH`, `HEIGHT`; maximale Anzahl der Iterationen pro Pixel als `MAX_ITERATIONS` 
- Benötigte Rechenzeit wird in Konsole ausgegeben


## Inhalt

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- */src*
    - enthält den Rust-Code
- */pkg*
    - enthält das kompilierte WebAssembly-Programm + Js-Glue-Code



## Ausführen

1. "Rust" installiert (https://www.rust-lang.org/tools/install)

2. "wasm-pack" installiert (https://rustwasm.github.io/wasm-pack/installer/)

3. Kompilieren mit `wasm-pack build --target web`

4. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)