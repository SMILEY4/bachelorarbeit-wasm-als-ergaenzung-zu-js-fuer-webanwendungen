# Mandelbrot JavaScript

Berechnet und zeigt eine Mandelbrot-Menge an.
- Mandelbrot-Menge wird im Canvas der angegebenen Größe angezeigt
  - Größe in "index.js" `WIDTH`, `HEIGHT`; maximale Anzahl der Iterationen pro Pixel als `MAX_ITERATIONS` 
- Benötigte Rechenzeit wird in Konsole ausgegeben

## Inhalt

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- *mandelbrot.js*
    - einfache Implementierung einer Mandelbrot-Menge
    - `setup`: Benchmark-Durchlauf vorbereiten, muss einmal ausgeführt werden und zählt nicht zur Laufzeit
    - `renderMandelbrot`: Berechnet und zeigt die Mandelbrot-Menge an


## Ausführen

- lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)

oder

- `npm install` und `npm run serve`
    
    - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
