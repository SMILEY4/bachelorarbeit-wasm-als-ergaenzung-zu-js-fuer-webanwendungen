# Mandelbrot Emscripten (C++)

Berechnet und zeigt eine Mandelbrot-Menge an.
- Mandelbrot-Menge wird im Canvas der angegebenen Größe angezeigt
  - Größe in "index.js" `WIDTH`, `HEIGHT`; maximale Anzahl der Iterationen pro Pixel als `MAX_ITERATIONS` 
- Benötigte Rechenzeit wird in Konsole ausgegeben


## Inhalt

- */src*
    - enthält den C++-Code
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- *mandelbrot.js*
    - eigene Schnittstelle zur Wasm-Instanz
    - `setup`: bereitet Ausführung vor. Muss einmal ausgeführt werden und zählt nicht zur Laufzeit
    - `renderMandelbrot`: berechnet und zeigt Mandelbrot-Menge an
    - `cleanup`: gibt Speicher frei. Nur einmal am Ende ausführen
- *wasmMandelbrot.js, -.wasm*
    - kompiliertes Wasm-Modul und automatisch generierte Schnittstelle 



## Ausführen

1. "emscripten" installieren (https://emscripten.org/docs/getting_started/downloads.html)

2. "make" installieren

2. C++-Code kompilieren mit `make`

3. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)