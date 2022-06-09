export declare namespace console {
  // Importieren der Funktion "log" im "console"-Namespace
  function log(msg: string): void;
}

export function concat(a: string, b: string): string {
  // Ausgeben der gegebenen Strings in Konsole via der importierten Funktion
  console.log("concat " + a + " and " + b);
  // Zusammenfügen und Zurückgeben der Strings
  return a + " " + b;
}
