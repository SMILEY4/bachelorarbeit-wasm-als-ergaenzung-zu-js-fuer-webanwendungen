# Raytacer Emscripten (C++)

Einfacher Raytracer in AssemblyScript

## Inhalt

- */src*
    - enthält den C++-Code
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
    - `WIDTH`: Breite des Bildes in Pixel
    - `HEIGHT`: Höhe des Bildes in Pixel
    - `MAX_DEPTH`: max. Anzahl an Rays pro Pixel
- *raytracer.js*
    - eigene Schnittstelle zur Wasm-Instanz
- *raytracer.js, -.wasm*
    - kompiliertes Wasm-Modul und automatisch generierte Schnittstelle 



## Ausführen

1. "emscripten" installieren (https://emscripten.org/docs/getting_started/downloads.html)

2. "make" installieren

2. C++-Code kompilieren mit `make`

3. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)