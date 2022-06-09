use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    // Importieren der Funktion "log" aus dem JavaScript-Namespace "console"
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn concat(a: &str, b: &str) -> String {
    // Ausgeben der gegebenen Strings in Konsole mit der importierten Funktion
    log(format!("concat {} and {}", a, b).as_str());
    // Zusammenfügen und Zurückgeben der Strings
    return format!("{} {}", a, b);
}