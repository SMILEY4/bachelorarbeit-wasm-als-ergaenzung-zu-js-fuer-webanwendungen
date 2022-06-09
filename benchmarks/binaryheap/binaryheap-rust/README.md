# Benchmark: Binary-Heap mit Rust

Binary-Heap: https://en.wikipedia.org/wiki/Binary_heap

Erstellt einen einfachen Binary-Heap und führt damit die folgenden Schritte aus
1. N1 "zufällige" Elemente einzeln hinzufügen
2. N2 "zufällige" Elemente einzeln entfernen
3. N1 "zufällige" Elemente einzeln hinzufügen
4. alle Elemente einzeln entfernen


## Inhalt

- */src*
    - enthält den Rust-Code des Raytracers (lib.rs)
        - seed: Seed für Random-Number-Generator (gleicher seed = gleiche Ergebnisse)
        - N1: Anzahl der im 1. und 3. Schritt zu hinzufügenden Elemente
        - N2: Anzahl der im 2. Schritt zu entfernenden Elemente
- */pkg*
    - enthält das kompilierte WebAssembly-Programm + Js-Glue-Code

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus


## Ausführen

1. "Rust" installiert (https://www.rust-lang.org/tools/install)

2. "wasm-pack" installiert (https://rustwasm.github.io/wasm-pack/installer/)

3. Kompilieren mit `wasm-pack build --target web`

4. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)