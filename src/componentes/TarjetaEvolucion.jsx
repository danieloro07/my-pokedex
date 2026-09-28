import { useState } from "react";
import { formatearDex } from "../constantes.js";
import estilos from "./TarjetaEvolucion.module.css";

/** Tarjeta clicable. Es un <button> para que funcione también con teclado. */
export default function TarjetaEvolucion({ evo, esActual, onClick }) {
  const [imagenRota, setImagenRota] = useState(false);

  return (
    <button
      type="button"
      className={`${estilos.tarjeta} ${esActual ? estilos.actual : ""}`}
      onClick={onClick}
      aria-current={esActual ? "true" : undefined}
    >
      {evo.imagen && !imagenRota ? (
        <img src={evo.imagen} alt="" loading="lazy" onError={() => setImagenRota(true)} />
      ) : (
        <span className={estilos.sinImagen} aria-hidden="true">?</span>
      )}
      <b className={estilos.nombre}>{evo.nombre}</b>
      <span className={estilos.numero}>{formatearDex(evo.id)}</span>
    </button>
  );
}
