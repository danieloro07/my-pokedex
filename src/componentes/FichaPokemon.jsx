import { useEffect } from "react";
import Escenario from "./Escenario.jsx";
import BloqueStats from "./BloqueStats.jsx";
import BloqueEvoluciones from "./BloqueEvoluciones.jsx";
import estilos from "./FichaPokemon.module.css";

/**
 * Contenedor del escenario + los bloques.
 * <App> lo monta con key={pokemon.id}: al cambiar de pokémon se crea desde
 * cero, así las animaciones de aparición y las evoluciones se reinician solas.
 */
export default function FichaPokemon({ pokemon, onElegir }) {
  // Volvemos arriba para ver la entrada del nuevo pokémon.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main>
      <Escenario pokemon={pokemon} />
      <div className={estilos.pista}>
        <BloqueStats pokemon={pokemon} />
        <BloqueEvoluciones
          urlEspecie={pokemon.urlEspecie}
          nombreActual={pokemon.nombre}
          onElegir={onElegir}
        />
      </div>
    </main>
  );
}
