// Color oficial de cada tipo. Da el acento visual de toda la página.
export const COLORES_TIPO = {
  normal: "#9a9a72", fire: "#ee8130", water: "#6390f0", electric: "#e0b91b",
  grass: "#5fae43", ice: "#68c2bf", fighting: "#c22e28", poison: "#a33ea1",
  ground: "#c9a253", flying: "#8e79e8", psychic: "#f95587", bug: "#93a318",
  rock: "#a3902f", ghost: "#735797", dragon: "#6f35fc", dark: "#5f4c3f",
  steel: "#8f8fa8", fairy: "#d685ad",
};

export const COLOR_POR_DEFECTO = "#6b7280";

// Nombres de las stats en español (la API los da en inglés)
export const NOMBRE_STAT = {
  hp: "PS", attack: "Ataque", defense: "Defensa",
  "special-attack": "At. especial", "special-defense": "Def. especial",
  speed: "Velocidad",
};

export const STAT_MAX = 180; // referencia para calcular el ancho de las barras

// Pokémon de ejemplo en la pantalla de inicio
export const ATAJOS = ["pikachu", "charizard", "gengar", "eevee", "mewtwo"];

/** Color de un tipo, o el gris por defecto si no lo conocemos. */
export function colorDeTipo(tipo) {
  return COLORES_TIPO[tipo] ?? COLOR_POR_DEFECTO;
}

/** 7 -> "#007" */
export function formatearDex(id) {
  return "#" + String(id).padStart(3, "0");
}
