import { NOMBRE_STAT, STAT_MAX } from "../constantes.js";
import estilos from "./BarraStat.module.css";

/** Una fila: etiqueta, número y barra que crece cuando `visible` pasa a true. */
export default function BarraStat({ nombre, valor, visible }) {
  const ancho = Math.min(100, (valor / STAT_MAX) * 100);

  return (
    <li className={`${estilos.fila} ${visible ? estilos.visible : ""}`}>
      <span className={estilos.etiqueta}>{NOMBRE_STAT[nombre] ?? nombre}</span>
      <span className={estilos.valor}>{valor}</span>
      <div
        className={estilos.canal}
        role="meter"
        aria-label={NOMBRE_STAT[nombre] ?? nombre}
        aria-valuemin={0}
        aria-valuemax={STAT_MAX}
        aria-valuenow={valor}
      >
        <i className={estilos.relleno} style={{ "--w": `${ancho.toFixed(1)}%` }} />
      </div>
    </li>
  );
}
