import { useCallback, useEffect, useRef, useState } from "react";
import {
  NoEncontradoError,
  obtenerListaNombres,
  pedirPokemon,
} from "../api/pokeapi.js";
import { extraerDatos } from "../utils/extraer.js";
import { validarBusqueda } from "../utils/validar.js";
import { buscarParecidos } from "../utils/similitud.js";

/** Convierte cualquier error de la búsqueda en un mensaje para el usuario. */
function mensajeDeError(error) {
  if (error.name === "TimeoutError") return "La búsqueda tardó demasiado. Intenta de nuevo.";
  if (error instanceof TypeError) return "No se pudo conectar con la API. Revisa tu conexión.";
  return error.message;
}

/**
 * Orquesta la búsqueda: validar → pedir → extraer → (si 404) sugerir.
 *
 * Evita carreras: cada búsqueda nueva ABORTA la anterior, y además
 * comprobamos que la respuesta pertenece a la última petición antes de
 * tocar el estado. Así "pikachu" lento nunca pisa a "charizard" rápido.
 */
export function useBuscarPokemon() {
  const [pokemon, setPokemon] = useState(null); // null = pantalla de inicio
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  const controladorRef = useRef(null);
  const ultimaPeticionRef = useRef(0);

  // Al desmontar, cancelamos lo que esté en vuelo.
  useEffect(() => () => controladorRef.current?.abort(), []);

  const limpiarAvisos = useCallback(() => {
    setError(null);
    setSugerencias([]);
  }, []);

  const buscar = useCallback(async (textoUsuario) => {
    const validacion = validarBusqueda(textoUsuario);
    if (!validacion.ok) {
      setError(validacion.error);
      setSugerencias([]);
      return; // ni siquiera llamamos a la API
    }

    controladorRef.current?.abort();
    const controlador = new AbortController();
    controladorRef.current = controlador;
    const idPeticion = ++ultimaPeticionRef.current;
    const esLaUltima = () => idPeticion === ultimaPeticionRef.current;

    setError(null);
    setSugerencias([]);
    setCargando(true);

    try {
      const data = await pedirPokemon(validacion.valor, { signal: controlador.signal });
      if (!esLaUltima()) return;
      setPokemon(extraerDatos(data));
    } catch (err) {
      // AbortError = la cancelamos nosotros porque llegó otra búsqueda.
      if (err.name === "AbortError" || !esLaUltima()) return;

      setError(mensajeDeError(err));

      if (err instanceof NoEncontradoError) {
        const nombres = await obtenerListaNombres();
        if (!esLaUltima()) return;
        setSugerencias(buscarParecidos(validacion.valor, nombres, 3));
      }
    } finally {
      if (esLaUltima()) setCargando(false);
    }
  }, []);

  return { pokemon, cargando, error, sugerencias, buscar, limpiarAvisos };
}
