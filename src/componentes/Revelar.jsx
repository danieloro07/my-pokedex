import { useRevelar } from "../hooks/useRevelar.js";

/**
 * Envoltorio para animar la aparición de un elemento suelto
 * (etiqueta, título, ficha…) sin repetir el hook en cada sitio.
 *
 *   <Revelar as="h3" className={estilos.titulo}>Hola</Revelar>
 */
export default function Revelar({ as: Etiqueta = "div", className = "", children, ...resto }) {
  const [ref, visible] = useRevelar();
  const clases = ["rev", visible && "visible", className].filter(Boolean).join(" ");
  return (
    <Etiqueta ref={ref} className={clases} {...resto}>
      {children}
    </Etiqueta>
  );
}
