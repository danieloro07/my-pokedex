/** Mejor imagen disponible de un pokémon, o "" si no tiene ninguna. */
export function extraerImagen(data) {
  return (
    data.sprites?.other?.["official-artwork"]?.front_default ??
    data.sprites?.front_default ??
    ""
  );
}

/** Del JSON gigante de la API saca solo lo que la interfaz necesita. */
export function extraerDatos(data) {
  return {
    id: data.id,
    nombre: data.name,
    especie: data.species?.name ?? "—",
    urlEspecie: data.species?.url ?? "",
    // data.types = [{ slot:1, type:{name:"fire"} }, ...] -> ["fire", ...]
    tipos: Array.isArray(data.types) ? data.types.map((t) => t.type.name) : [],
    // data.stats = [{ base_stat:78, stat:{name:"hp"} }, ...]
    stats: Array.isArray(data.stats)
      ? data.stats.map((s) => ({ nombre: s.stat.name, valor: s.base_stat }))
      : [],
    imagen: extraerImagen(data),
  };
}

/* La cadena es un árbol: cada nodo tiene evolves_to, que es otro arreglo
   de nodos. Esta función recursiva lo aplana a una lista de nombres. */
export function aplanarCadena(nodo, acumulado = []) {
  acumulado.push(nodo.species.name);
  nodo.evolves_to.forEach((hijo) => aplanarCadena(hijo, acumulado));
  return acumulado;
}
