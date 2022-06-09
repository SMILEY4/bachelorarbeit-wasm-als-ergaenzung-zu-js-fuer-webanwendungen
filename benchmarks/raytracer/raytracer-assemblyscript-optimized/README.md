# Raytracer AssemblyScript

Einfacher Raytracer in AssemblyScript. Manuell optimiert, um instanziierung neuer Objekte zu vermeiden.


## Inhalt

- */assembly*
    - enthält den AssemblyScript-Code (Einstiegspunkt = "index.ts")
    - Einstellungen in "index.ts"
        - `WIDTH`: Breite des Bildes in Pixel (muss auch in index.js angepasst werden!)
        - `HEIGHT`: Höhe des Bildes in Pixel (muss auch in index.js angepasst werden!)
        - `MAX_DEPTH`: max. Anzahl an Rays pro Pixel
- */build*
    - enthält das kompilierte WebAssembly-Programm
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- *raytracer.js*
    - eigene Schnittstelle zur Wasm-Instanz
    - `setup`: bereitet Ausführung vor. Muss einmal ausgeführt werden und zählt nicht zur Laufzeit
    - `render`: berechnet Bild


## Ausführen

1. Abhängigkeiten installieren

   ```
   npm install
   ```

2. AssemblyScript kompilieren

   ```
   npm run asbuild:release
   ```

3. Server mit Anwendung starten

   ```
   npm run serve
   ```


## TODO / Notes

- pussible optimisations: reduce allocations (`__new`) for Vector-Math