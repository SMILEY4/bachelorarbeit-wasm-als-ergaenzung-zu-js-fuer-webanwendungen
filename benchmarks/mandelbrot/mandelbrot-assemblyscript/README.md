# Mandelbrot AssemblyScript

Berechnet und zeigt eine Mandelbrot-Menge an.
- Mandelbrot-Menge wird im Canvas der angegebenen Größe angezeigt
  - Größe in "index.js" `WIDTH`, `HEIGHT`; maximale Anzahl der Iterationen pro Pixel als `MAX_ITERATIONS` 
- Benötigte Rechenzeit wird in Konsole ausgegeben



## Inhalt

- */assembly*
    - enthält den AssemblyScript-Code
- */build*
    - enthält das kompilierte WebAssembly-Programm
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- *mandelbrot.js*
    - eigene Schnittstelle zur Wasm-Instanz
    - `setup`: bereitet Ausführung vor. Muss einmal ausgeführt werden und zählt nicht zur Laufzeit
    - `renderMandelbrot`: berechnet und zeigt Mandelbrot-Menge an




## Ausführen

1. Abhängigkeiten installieren

   ```
   npm install
   ```

2. AssemblyScript kompilieren

   ```
   npm run asbuild
   ```

3. Server mit Anwendung starten

   ```
   npm run serve
   ```
