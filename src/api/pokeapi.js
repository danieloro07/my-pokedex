import { aplanarCadena, extraerImagen } from "../utils/extraer.js";

export const API = "https://pokeapi.co/api/v2/pokemon/";
// Endpoint que devuelve SOLO la lista de nombres (para las sugerencias).
export const API_LISTA = "https://pokeapi.co/api/v2/pokemon?limit=100000";
export const TIEMPO_MAXIMO_MS = 8000;

/**
 * Une la señal del llamador (para cancelar desde un efecto) con un timeout.
 * - Si vence el tiempo, fetch lanza un error con name === "TimeoutError".
 * - Si cancela el llamador, lanza name === "AbortError".
 * Así el hook puede distinguir "tardó demasiado" de "ya no me interesa".
 */
function conTimeout(signal) {
  const timeout = AbortSignal.timeout(TIEMPO_MAXIMO_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

/** Error propio para el 404: el hook lo usa para pedir sugerencias. */
export class NoEncontradoError extends Error {
  constructor(valor) {
    super(`No existe ningún pokémon llamado "${valor}".`);
    this.name = "NoEncontradoError";
    this.valor = valor;
  }
}

async function pedirJson(url, signal) {
  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) {
    throw new Error(`La API respondió con error ${respuesta.status}.`);
  }
  return respuesta.json();
}

/** Pide un pokémon por nombre o id. */
export async function pedirPokemon(valor, { signal } = {}) {
  const respuesta = await fetch(API + encodeURIComponent(valor), {
    signal: conTimeout(signal),
  });

  // OJO: fetch NO lanza error con un 404. Hay que revisarlo a mano.
  if (respuesta.status === 404) throw new NoEncontradoError(valor);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con error ${respuesta.status}.`);
  }
  return respuesta.json();
}

/* Caché a nivel de módulo: vive fuera de cualquier componente, así que no se
   reinicia con los renders. Guardamos la PROMESA (no el resultado) para que
   dos búsquedas simultáneas no descarguen la lista dos veces. */
let promesaNombres = null;

/** Lista completa de nombres. Si falla, devuelve [] (seguimos sin sugerencias). */
export function obtenerListaNombres() {
  if (promesaNombres === null) {
    promesaNombres = pedirJson(API_LISTA)
      .then((data) => data.results.map((p) => p.name))
      .catch(() => {
        promesaNombres = null; // permitimos reintentar la próxima vez
        return [];
      });
  }
  return promesaNombres;
}

/** Solo para tests: vacía la caché. */
export function _reiniciarCache() {
  promesaNombres = null;
}

/** species → evolution-chain → detalles de cada miembro (en paralelo). */
export async function obtenerEvoluciones(urlEspecie, { signal } = {}) {
  // Paso 1: la especie nos dice DÓNDE está su cadena evolutiva
  const especie = await pedirJson(urlEspecie, signal);

  // Paso 2: pedimos esa cadena (este await depende del anterior)
  const cadena = await pedirJson(especie.evolution_chain.url, signal);
  const nombres = aplanarCadena(cadena.chain);

  // Paso 3: las imágenes NO dependen entre sí → todas a la vez con Promise.all
  const detalles = await Promise.all(
    nombres.map((n) =>
      fetch(API + n, { signal }).then((r) => (r.ok ? r.json() : null))
    )
  );

  return detalles.filter(Boolean).map((d) => ({
    nombre: d.name,
    id: d.id,
    imagen: extraerImagen(d),
  }));
}
