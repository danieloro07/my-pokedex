import { useCallback, useState } from "react";
import { ATAJOS, COLOR_POR_DEFECTO, colorDeTipo } from "./constantes.js";
import { useBuscarPokemon } from "./hooks/useBuscarPokemon.js";
import { useAltura } from "./hooks/useAltura.js";
import Barra from "./componentes/Barra.jsx";
import Buscador from "./componentes/Buscador.jsx";
import Avisos from "./componentes/Avisos.jsx";
import Atajos from "./componentes/Atajos.jsx";
import Inicio from "./componentes/Inicio.jsx";
import FichaPokemon from "./componentes/FichaPokemon.jsx";

/** Dueño del estado. Decide si se ve <Inicio> o <FichaPokemon>. */
export default function App() {
  const { pokemon, cargando, error, sugerencias, buscar, limpiarAvisos } = useBuscarPokemon();
  const [texto, setTexto] = useState("");
  const [refBarra, altoBarra] = useAltura();

  const cambiarTexto = useCallback((valor) => {
    setTexto(valor);
    limpiarAvisos(); // al escribir, desaparece el error anterior
  }, [limpiarAvisos]);

  // Atajos, sugerencias y evoluciones: escriben el nombre y buscan.
  const elegir = useCallback((nombre) => {
    setTexto(nombre);
    buscar(nombre);
  }, [buscar]);

  const propsBuscador = { texto, onCambiar: cambiarTexto, onBuscar: buscar, cargando };
  const propsAvisos = { error, cargando, sugerencias, onElegir: elegir };

  // Tokens que dependen del estado: el color del tipo principal y el alto
  // real de la barra. Todo lo que está dentro los hereda por CSS.
  const tokens = {
    "--acento": pokemon ? colorDeTipo(pokemon.tipos[0]) : COLOR_POR_DEFECTO,
    ...(altoBarra ? { "--barra": `${altoBarra}px` } : {}),
  };

  return (
    <div style={tokens}>
      {pokemon ? (
        <>
          <Barra ref={refBarra}>
            <Buscador variante="compacto" {...propsBuscador} />
          </Barra>
          <Avisos {...propsAvisos} />
          <FichaPokemon key={pokemon.id} pokemon={pokemon} onElegir={elegir} />
        </>
      ) : (
        <Inicio pie={<Atajos nombres={ATAJOS} onElegir={elegir} />}>
          <Buscador variante="grande" {...propsBuscador} />
          <Avisos enInicio {...propsAvisos} />
        </Inicio>
      )}
    </div>
  );
}
