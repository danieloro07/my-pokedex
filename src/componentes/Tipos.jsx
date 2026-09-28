import { colorDeTipo } from "../constantes.js";
import estilos from "./Tipos.module.css";

export default function Tipos({ tipos }) {
  return (
    <div className={estilos.tipos}>
      {tipos.map((tipo) => (
        <span key={tipo} className={estilos.tipo} style={{ background: colorDeTipo(tipo) }}>
          {tipo}
        </span>
      ))}
    </div>
  );
}
