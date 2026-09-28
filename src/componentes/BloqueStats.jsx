import { formatearDex } from "../constantes.js";
import { useRevelar } from "../hooks/useRevelar.js";
import Bloque from "./Bloque.jsx";
import BarraStat from "./BarraStat.jsx";
import Revelar from "./Revelar.jsx";
import estilos from "./BloqueStats.module.css";

export default function BloqueStats({ pokemon }) {
  // Un solo observador para la lista: todas las barras crecen a la vez.
  const [refStats, statsVisibles] = useRevelar();

  return (
    <Bloque etiqueta="Estadísticas base" titulo="De qué está hecho">
      <Revelar as="dl" className={estilos.ficha}>
        <div><dt>Especie</dt><dd>{pokemon.especie}</dd></div>
        <div><dt>N.º Pokédex</dt><dd>{formatearDex(pokemon.id)}</dd></div>
      </Revelar>

      <ul ref={refStats} className={`${estilos.stats} rev ${statsVisibles ? "visible" : ""}`}>
        {pokemon.stats.map((s) => (
          <BarraStat key={s.nombre} nombre={s.nombre} valor={s.valor} visible={statsVisibles} />
        ))}
      </ul>
    </Bloque>
  );
}
