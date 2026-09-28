import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App.jsx";
import { _reiniciarCache } from "../api/pokeapi.js";
import { instalarFetch, pokemonFalso } from "./apiFalsa.js";

const ESPECIE = "/pokemon-species/25/";
const CADENA = "/evolution-chain/10/";

function rutasPikachu() {
  const hoja = (n) => ({ species: { name: n }, evolves_to: [] });
  return {
    "/pokemon/pikachu": { cuerpo: pokemonFalso("pikachu", 25) },
    "/pokemon/pichu": { cuerpo: pokemonFalso("pichu", 172) },
    "/pokemon/raichu": { cuerpo: pokemonFalso("raichu", 26) },
    [ESPECIE]: { cuerpo: { evolution_chain: { url: "https://pokeapi.co/api/v2" + CADENA } } },
    [CADENA]: {
      cuerpo: { chain: { species: { name: "pichu" }, evolves_to: [
        { species: { name: "pikachu" }, evolves_to: [hoja("raichu")] },
      ] } },
    },
  };
}

beforeEach(() => {
  _reiniciarCache();
  window.scrollTo = vi.fn();
});
afterEach(() => vi.unstubAllGlobals());

describe("App", () => {
  it("de la pantalla de inicio a la ficha, con evoluciones clicables", async () => {
    instalarFetch(rutasPikachu());
    const usuario = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("POKÉDEX");
    await usuario.type(screen.getByLabelText(/nombre o id/i), "pikachu");
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));

    // Ficha: nombre, tipo, stats
    expect(await screen.findByRole("heading", { level: 2, name: "pikachu" })).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Velocidad" })).toHaveAttribute("aria-valuenow", "90");

    // El buscador se "mudó" a la barra y conserva el texto
    const barra = screen.getByRole("banner");
    expect(within(barra).getByLabelText(/nombre o id/i)).toHaveValue("pikachu");

    // Cadena evolutiva: pichu → pikachu (actual) → raichu
    const raichu = await screen.findByRole("button", { name: /raichu/ });
    expect(screen.getByRole("button", { name: /pikachu/, current: true })).toBeInTheDocument();

    await usuario.click(raichu);
    expect(await screen.findByRole("heading", { level: 2, name: "raichu" })).toBeInTheDocument();
    expect(within(barra).getByLabelText(/nombre o id/i)).toHaveValue("raichu");
  });

  it("los atajos buscan directamente", async () => {
    instalarFetch(rutasPikachu());
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "pikachu" }));
    expect(await screen.findByRole("heading", { level: 2, name: "pikachu" })).toBeInTheDocument();
  });

  it("sugiere y al elegir la sugerencia busca", async () => {
    instalarFetch({
      ...rutasPikachu(),
      "/pokemon/pikahu": { status: 404, cuerpo: {} },
      "?limit=100000": { cuerpo: { results: [{ name: "pikachu" }, { name: "pichu" }] } },
    });
    const usuario = userEvent.setup();
    render(<App />);
    await usuario.type(screen.getByLabelText(/nombre o id/i), "pikahu{Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent(/pikahu/);
    const caja = (await screen.findByText(/Quisiste decir/)).parentElement;
    await usuario.click(within(caja).getByRole("button", { name: "pikachu" }));
    expect(await screen.findByRole("heading", { level: 2, name: "pikachu" })).toBeInTheDocument();
  });

  it("al escribir se borra el error anterior", async () => {
    instalarFetch({});
    const usuario = userEvent.setup();
    render(<App />);
    await usuario.click(screen.getByRole("button", { name: "Buscar" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await usuario.type(screen.getByLabelText(/nombre o id/i), "p");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
