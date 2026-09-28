/**
 * Limpia y valida lo que escribe el usuario.
 * @returns {{ok: true, valor: string} | {ok: false, error: string}}
 */
export function validarBusqueda(textoCrudo) {
  const texto = textoCrudo.trim().toLowerCase();

  if (texto === "") {
    return { ok: false, error: "Escribe el nombre o el id de un pokémon." };
  }

  if (/^\d+$/.test(texto)) {
    const numero = Number(texto);
    if (numero < 1) return { ok: false, error: "El id debe ser un número mayor que 0." };
    if (numero > 100000) return { ok: false, error: "Ese id es demasiado grande, no existe." };
    return { ok: true, valor: String(numero) }; // "007" -> "7"
  }

  if (!/^[a-z0-9-]+$/.test(texto)) {
    return { ok: false, error: "Nombre inválido: usa solo letras, números y guiones (ej: mr-mime)." };
  }

  return { ok: true, valor: texto };
}
