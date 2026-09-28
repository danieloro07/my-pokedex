import { useState } from "react";
import { formatearDex } from "../constantes.js";
import { useProgresoScroll } from "../hooks/useProgresoScroll.js";
import Tipos from "./Tipos.jsx";
import estilos from "./Escenario.module.css";

/**
 * Imagen grande sticky. React solo escribe la variable --p;
 * las animaciones siguen siendo CSS puro (ver Escenario.module.css).
 */
export default function Escenario({ pokemon }) {
  const progreso = useProgresoScroll();
  const [imagenRota, setImagenRota] = useState(false);
  const mostrarImagen = pokemon.imagen && !imagenRota;

  return (
    <div className={estilos.escenario} style={{ "--p": progreso.toFixed(3) }}>
      <div className={estilos.halo} aria-hidden="true" />
      <span className={estilos.numero} aria-hidden="true">
        {formatearDex(pokemon.id)}
      </span>

      {mostrarImagen && (
        <img
          className={estilos.imagen}
          src={pokemon.imagen}
          alt={pokemon.nombre}
          onError={() => setImagenRota(true)}
        />
      )}

      <div className={estilos.titulo}>
        <h2 className={estilos.nombre}>{pokemon.nombre}</h2>
        <Tipos tipos={pokemon.tipos} />
      </div>

      <div className={estilos.pistaScroll} aria-hidden="true">Scroll ↓</div>
    </div>
  );
}
