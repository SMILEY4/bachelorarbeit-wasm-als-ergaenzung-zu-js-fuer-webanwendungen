# Benchmark: Binary-Heap mit C++ (Emscripten)

Binary-Heap: https://en.wikipedia.org/wiki/Binary_heap

Erstellt einen einfachen Binary-Heap und führt damit die folgenden Schritte aus
1. N1 "zufällige" Elemente einzeln hinzufügen
2. N2 "zufällige" Elemente einzeln entfernen
3. N1 "zufällige" Elemente einzeln hinzufügen
4. alle Elemente einzeln entfernen



## Inhalt

- *./src*
    
    - enthält den C++-Code
    
- *wasmBinaryHeap.js und wasmBinaryHeap.wasm*
    - generiertes Wasm-Modul und JS-Code
    
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
    
- *binaryHeap.js*
  
    - eigene Schnittstelle zur Wasm-Instanz
    - Parameter von runBinaryHeap:
        - seed: Seed für Random-Number-Generator (gleicher seed = gleiche Ergebnisse)
        - N1: Anzahl der im 1. und 3. Schritt zu hinzufügenden Elemente
        - N2: Anzahl der im 2. Schritt zu entfernenden Elemente
    
    


## Ausführen

1. "emscripten" installieren (https://emscripten.org/docs/getting_started/downloads.html)

2. "make" installieren

2. C++-Code kompilieren mit `make`

3. lokalen Server starten mit `http-server`

   - "npm" muss dafür installiert sein (https://emscripten.org/docs/getting_started/downloads.html) ...
   - ... und das npm-Packet "http-server" als globales Packet (`npm install -g http-server`)