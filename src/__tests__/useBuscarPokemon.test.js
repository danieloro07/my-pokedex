import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useBuscarPokemon } from "../hooks/useBuscarPokemon.js";
import { _reiniciarCache } from "../api/pokeapi.js";
import { instalarFetch, pokemonFalso } from "./apiFalsa.js";

beforeEach(() => _reiniciarCache());
afterEach(() => vi.unstubAllGlobals());

describe("useBuscarPokemon", () => {
  it("no llama a la API si la entrada es inválida", async () => {
    const fetch = instalarFetch({});
    const { result } = renderHook(() => useBuscarPokemon());
    await act(() => result.current.buscar("   "));
    expect(result.current.error).toMatch(/Escribe el nombre/);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("guarda el pokémon ya extraído", async () => {
    instalarFetch({ "/pokemon/pikachu": { cuerpo: pokemonFalso("pikachu", 25) } });
    const { result } = renderHook(() => useBuscarPokemon());
    await act(() => result.current.buscar("Pikachu"));
    expect(result.current.pokemon).toMatchObject({ id: 25, nombre: "pikachu", tipos: ["electric"] });
    expect(result.current.cargando).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("evita carreras: una respuesta lenta no pisa a la más reciente", async () => {
    instalarFetch({
      "/pokemon/pikachu": { cuerpo: pokemonFalso("pikachu", 25), demora: 80 },
      "/pokemon/charizard": { cuerpo: pokemonFalso("charizard", 6, "fire"), demora: 5 },
    });
    const { result } = renderHook(() => useBuscarPokemon());
    act(() => { result.current.buscar("pikachu"); });
    act(() => { result.current.buscar("charizard"); });

    await waitFor(() => expect(result.current.pokemon?.nombre).toBe("charizard"));
    await new Promise((r) => setTimeout(r, 120)); // dejamos que "llegue" la lenta
    expect(result.current.pokemon.nombre).toBe("charizard");
    expect(result.current.cargando).toBe(false);
  });

  it("en un 404 muestra el error y propone nombres parecidos", async () => {
    instalarFetch({
      "/pokemon/chramander": { status: 404, cuerpo: {} },
      "?limit=100000": {
        cuerpo: { results: ["charmander", "charmeleon", "pikachu"].map((name) => ({ name })) },
      },
    });
    const { result } = renderHook(() => useBuscarPokemon());
    await act(() => result.current.buscar("chramander"));
    expect(result.current.error).toMatch(/No existe ningún pokémon llamado "chramander"/);
    expect(result.current.sugerencias[0]).toBe("charmander");
  });

  it("distingue sin conexión (TypeError)", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    const { result } = renderHook(() => useBuscarPokemon());
    await act(() => result.current.buscar("pikachu"));
    expect(result.current.error).toMatch(/No se pudo conectar/);
  });

  it("distingue el timeout", async () => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.reject(new DOMException("tardó", "TimeoutError"))));
    const { result } = renderHook(() => useBuscarPokemon());
    await act(() => result.current.buscar("pikachu"));
    expect(result.current.error).toMatch(/tardó demasiado/);
  });
});
