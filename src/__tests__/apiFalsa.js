import { vi } from "vitest";

/** Respuesta mínima compatible con fetch. */
export function respuesta(cuerpo, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => cuerpo };
}

export function pokemonFalso(nombre, id, tipo = "electric") {
  return {
    id, name: nombre,
    species: { name: nombre, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    types: [{ type: { name: tipo } }],
    stats: [{ base_stat: 35, stat: { name: "hp" } }, { base_stat: 90, stat: { name: "speed" } }],
    sprites: { front_default: `${nombre}.png` },
  };
}

/**
 * fetch falso: `rutas` mapea un fragmento de URL a
 * { cuerpo, status, demora }. Respeta AbortSignal como el real.
 */
export function instalarFetch(rutas) {
  const falso = vi.fn((url, { signal } = {}) => {
    const clave = Object.keys(rutas).find((k) => url.endsWith(k));
    const r = clave ? rutas[clave] : { status: 404, cuerpo: {} };
    return new Promise((resolver, rechazar) => {
      const t = setTimeout(() => resolver(respuesta(r.cuerpo, r.status ?? 200)), r.demora ?? 0);
      signal?.addEventListener("abort", () => {
        clearTimeout(t);
        rechazar(signal.reason ?? new DOMException("Aborted", "AbortError"));
      });
    });
  });
  vi.stubGlobal("fetch", falso);
  return falso;
}
