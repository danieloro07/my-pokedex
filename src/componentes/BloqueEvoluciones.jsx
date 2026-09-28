import { Fragment } from "react";
import { useEvoluciones } from "../hooks/useEvoluciones.js";
import Bloque from "./Bloque.jsx";
import Revelar from "./Revelar.jsx";
import TarjetaEvolucion from "./TarjetaEvolucion.jsx";
import estilos from "./BloqueEvoluciones.module.css";

export default function BloqueEvoluciones({ urlEspecie, nombreActual, onElegir }) {
  const { lista, cargando, error } = useEvoluciones(urlEspecie);

  let contenido;
  if (!urlEspecie) {
    contenido = <span className={estilos.nota}>Línea evolutiva no disponible.</span>;
  } else if (cargando) {
    contenido = <span className={estilos.nota}>Cargando evoluciones…</span>;
  } else if (error) {
    contenido = <span className={estilos.nota}>{error}</span>;
  } else if (lista.length <= 1) {
    contenido = <span className={estilos.nota}>Este pokémon no evoluciona.</span>;
  } else {
    contenido = lista.map((evo, i) => (
      <Fragment key={evo.id}>
        {i > 0 && <span className={estilos.flecha} aria-hidden="true">→</span>}
        <TarjetaEvolucion
          evo={evo}
          esActual={evo.nombre === nombreActual}
          onClick={() => onElegir(evo.nombre)}
        />
      </Fragment>
    ));
  }

  return (
    <Bloque etiqueta="Línea evolutiva" titulo="En qué se convierte">
      <Revelar className={estilos.evo} aria-live="polite">{contenido}</Revelar>
    </Bloque>
  );
}
