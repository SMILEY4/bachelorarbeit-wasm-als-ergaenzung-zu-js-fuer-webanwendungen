# Beispielanwendung AssemblyScript 

Eine einfache Beispielanwendung zum demonstrieren der Basisfunktionalitäten von AssemblyScript.

### Ausführen

1. "npm" installiert (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-nodejs)

2. Für Anwendung benötigten Anhängigkeiten installieren mit `npm install`

3. AssemblyScript-Code kompilieren mit `npm run asbuild`

4. lokalen Server starten mit `npm run serve`

   - Alternativ mit dem Befehl `http-server`; benötigt Packet "http-server" installiert als globales Packet (`npm install -g http-server`)

    

### Inhalt

- *index.html* - HTML-Code der Seite, lädt *index.js*
- *index.js* - Einstiegspunkt der Anwendung, Lädt,Instanziert Wasm-Modul und ruft von Wasm-Instanz exportierte Funktionen auf
- *./assembly/index.ts* - AssemblyScript-Code, der dann in Wasm kompiliert wird
- *./build/* - die beim Kompilieren generierten Dateien