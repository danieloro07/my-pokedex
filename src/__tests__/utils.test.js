import { describe, expect, it } from "vitest";
import { validarBusqueda } from "../utils/validar.js";
import { buscarParecidos, distancia } from "../utils/similitud.js";
import { aplanarCadena, extraerDatos } from "../utils/extraer.js";

describe("validarBusqueda", () => {
  it("limpia espacios y mayúsculas", () => {
    expect(validarBusqueda("  PikaChu ")).toEqual({ ok: true, valor: "pikachu" });
  });
  it("normaliza ids con ceros a la izquierda", () => {
    expect(validarBusqueda("007")).toEqual({ ok: true, valor: "7" });
  });
  it("rechaza vacío, 0, ids enormes y caracteres raros", () => {
    expect(validarBusqueda("   ").ok).toBe(false);
    expect(validarBusqueda("0").ok).toBe(false);
    expect(validarBusqueda("100001").ok).toBe(false);
    expect(validarBusqueda("mr mime").ok).toBe(false);
    expect(validarBusqueda("<script>").ok).toBe(false);
  });
  it("acepta guiones", () => {
    expect(validarBusqueda("mr-mime")).toEqual({ ok: true, valor: "mr-mime" });
  });
});

describe("distancia", () => {
  it("calcula Levenshtein", () => {
    expect(distancia("gato", "gato")).toBe(0);
    expect(distancia("", "abc")).toBe(3);
    expect(distancia("kitten", "sitting")).toBe(3);
  });
});

describe("buscarParecidos", () => {
  const nombres = ["charmander", "charmeleon", "charizard", "pikachu", "pichu", "bulbasaur"];
  it("corrige errores de tipeo", () => {
    expect(buscarParecidos("chramander", nombres)[0]).toBe("charmander");
  });
  it("completa prefijos", () => {
    expect(buscarParecidos("pika", nombres)).toContain("pikachu");
  });
  it("respeta el máximo", () => {
    expect(buscarParecidos("char", nombres, 2)).toHaveLength(2);
  });
});

describe("extraerDatos", () => {
  it("saca solo lo necesario", () => {
    const data = {
      id: 6, name: "charizard",
      species: { name: "charizard", url: "u/6" },
      types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
      stats: [{ base_stat: 78, stat: { name: "hp" } }],
      sprites: { front_default: "f.png", other: { "official-artwork": { front_default: "art.png" } } },
    };
    expect(extraerDatos(data)).toEqual({
      id: 6, nombre: "charizard", especie: "charizard", urlEspecie: "u/6",
      tipos: ["fire", "flying"], stats: [{ nombre: "hp", valor: 78 }], imagen: "art.png",
    });
  });
  it("tolera datos incompletos", () => {
    const r = extraerDatos({ id: 1, name: "x" });
    expect(r).toMatchObject({ especie: "—", urlEspecie: "", tipos: [], stats: [], imagen: "" });
  });
});

describe("aplanarCadena", () => {
  it("recorre el árbol completo, incluidas ramas", () => {
    const hoja = (n) => ({ species: { name: n }, evolves_to: [] });
    const arbol = { species: { name: "eevee" }, evolves_to: [hoja("vaporeon"), hoja("jolteon")] };
    expect(aplanarCadena(arbol)).toEqual(["eevee", "vaporeon", "jolteon"]);
  });
});
