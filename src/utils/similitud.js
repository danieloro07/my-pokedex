/* Distancia de Levenshtein: cuántas ediciones (insertar, borrar o cambiar
   una letra) hacen falta para convertir "a" en "b". */
export function distancia(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const fila = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    let diagonal = fila[0];
    fila[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const previo = fila[j];
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      fila[j] = Math.min(fila[j] + 1, fila[j - 1] + 1, diagonal + costo);
      diagonal = previo;
    }
  }
  return fila[b.length];
}

/** Elige los `max` nombres más parecidos a `texto`. */
export function buscarParecidos(texto, nombres, max = 3) {
  const tolerancia = Math.max(2, Math.floor(texto.length / 3) + 1);
  const candidatos = [];

  for (const nombre of nombres) {
    if (Math.abs(nombre.length - texto.length) > tolerancia) continue; // filtro rápido
    const d = distancia(texto, nombre);
    if (d <= tolerancia) candidatos.push({ nombre, puntaje: d });
  }

  if (texto.length >= 3) { // prefijos: "pika" -> "pikachu"
    for (const nombre of nombres) {
      if (nombre.startsWith(texto) && !candidatos.some((c) => c.nombre === nombre)) {
        candidatos.push({ nombre, puntaje: 0.5 });
      }
    }
  }

  candidatos.sort((a, b) => a.puntaje - b.puntaje || a.nombre.length - b.nombre.length);
  return candidatos.slice(0, max).map((c) => c.nombre);
}
