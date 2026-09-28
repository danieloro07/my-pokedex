import Revelar from "./Revelar.jsx";
import estilos from "./Bloque.module.css";

/** Sección de la pista: etiqueta de color + título grande + contenido. */
export default function Bloque({ etiqueta, titulo, children }) {
  return (
    <section className={estilos.bloque}>
      <div className={estilos.interior}>
        <Revelar as="p" className={estilos.etiqueta}>{etiqueta}</Revelar>
        <Revelar as="h3" className={estilos.titulo}>{titulo}</Revelar>
        {children}
      </div>
    </section>
  );
}
