# Raytracer JavaScript

Einfacher Raytracer in JavaScript


## Inhalt

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
        - `WIDTH`: Breite des Bildes in Pixel
        - `HEIGHT`: Höhe des Bildes in Pixel
        - `MAX_DEPTH`: maximale Anzahl an "bounces" (=1 => keine Reflexionen)
- *raytracer.js*
    - einfache Implementierung eines Raytracers
    - `setup`: Benchmark-Durchlauf vorbereiten, muss einmal ausgeführt werden und zählt nicht zur Laufzeit
        - erwartet als Parameter die Größe des Bildes in Pixel sowie die max. Anzahl an "bounces" (maxDepth=1 => keine Reflexionen)
    - `render`: Berechnet und zeigt das Bild an


## Ausführen

- lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)

oder

- `npm install` und `npm run serve`
    
    - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
