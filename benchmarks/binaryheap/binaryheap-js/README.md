# Benchmark: Binary-Heap mit JavaScript

Binary-Heap: https://en.wikipedia.org/wiki/Binary_heap

Erstellt einen einfachen Binary-Heap und führt damit die folgenden Schritte aus
1. N1 "zufällige" Elemente einzeln hinzufügen
2. N2 "zufällige" Elemente einzeln entfernen
3. N1 "zufällige" Elemente einzeln hinzufügen
4. alle Elemente einzeln entfernen


## Inhalt

- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
- *binaryHeap.js*
    - einfache Implementierung eines Binary-Heaps mit Test-Funktion (`runBinaryHeap(...)`)
    - Parameter
        - seed: Seed für Random-Number-Generator (gleicher seed = gleiche Ergebnisse)
        - N1: Anzahl der im 1. und 3. Schritt zu hinzufügenden Elemente
        - N2: Anzahl der im 2. Schritt zu entfernenden Elemente


## Ausführen

- lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)

oder

- `npm install` und `npm run serve`
    
    - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
