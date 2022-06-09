# Benchmark: Binary-Heap mit AssemblyScript

Binary-Heap: https://en.wikipedia.org/wiki/Binary_heap

Erstellt einen einfachen Binary-Heap und führt damit die folgenden Schritte aus
1. N1 "zufällige" Elemente einzeln hinzufügen
2. N2 "zufällige" Elemente einzeln entfernen
3. N1 "zufällige" Elemente einzeln hinzufügen
4. alle Elemente einzeln entfernen



## Inhalt

- *./assembly*
    
    - enthält den AssemblyScript-Code
    
- *./build*
    - enthält das kompilierte WebAssembly-Programm
    
- *index.js*
    - Einstiegspunkt der Anwendung, führt Benchmark aus
    
- *binaryHeap.js*
    
    - eigene Schnittstelle zur Wasm-Instanz
    - Parameter von runBinaryHeap:
        - seed: Seed für Random-Number-Generator (gleicher seed = gleiche Ergebnisse)
        - N1: Anzahl der im 1. und 3. Schritt zu hinzufügenden Elemente
        - N2: Anzahl der im 2. Schritt zu entfernenden Elemente
    
    


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
