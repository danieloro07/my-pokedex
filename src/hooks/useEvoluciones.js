import { useEffect, useState } from "react";
import { obtenerEvoluciones } from "../api/pokeapi.js";

/**
 * Pide la cadena evolutiva cada vez que cambia `urlEspecie`.
 *
 * Guardamos junto al resultado la URL a la que pertenece: si no coincide con
 * la actual, es que todavía estamos cargando. Así no hace falta "reiniciar"
 * el estado a mano al cambiar de pokémon, y nunca se ve la cadena anterior.
 */
export function useEvoluciones(urlEspecie) {
  const [resultado, setResultado] = useState({ url: null, lista: [], error: null });

  useEffect(() => {
    if (!urlEspecie) return;
    const controlador = new AbortController();

    obtenerEvoluciones(urlEspecie, { signal: controlador.signal })
      .then((lista) => setResultado({ url: urlEspecie, lista, error: null }))
      .catch((err) => {
        if (err.name === "AbortError") return; // cambió de pokémon: descartamos
        setResultado({
          url: urlEspecie,
          lista: [],
          error: "No se pudo cargar la línea evolutiva.",
        });
      });

    // Cleanup: si el usuario ya cambió de pokémon, abortamos la petición vieja.
    return () => controlador.abort();
  }, [urlEspecie]);

  const vigente = resultado.url === urlEspecie;
  return {
    lista: vigente ? resultado.lista : [],
    error: vigente ? resultado.error : null,
    cargando: Boolean(urlEspecie) && !vigente,
  };
}
