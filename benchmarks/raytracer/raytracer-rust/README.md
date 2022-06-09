# Raytracer Rust

Einfacher Raytracer in Rust


## Inhalt

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- */src*
    - enthält den Rust-Code des Raytracers (lib.rs)
    - Größe und max. Anzahl an Strahlen einstellbar in "lib.rs"
        - `WIDTH`: Breite des Bildes in Pixel
        - `HEIGHT`: Höhe des Bildes in Pixel
        - `MAX_DEPTH`: max. Anzahl an Rays pro Pixel
- */pkg*
    - enthält das kompilierte WebAssembly-Programm + Js-Glue-Code


## Ausführen

1. "Rust" installiert (https://www.rust-lang.org/tools/install)

2. "wasm-pack" installiert (https://rustwasm.github.io/wasm-pack/installer/)

3. Kompilieren mit `wasm-pack build --target web`

4. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)