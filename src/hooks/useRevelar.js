import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver: `visible` pasa a true cuando el elemento entra en
 * pantalla (y se queda así; dejamos de observar).
 *
 *   const [ref, visible] = useRevelar();
 *   <section ref={ref} className={visible ? "rev visible" : "rev"}>
 */
export function useRevelar({ threshold = 0.25 } = {}) {
  const ref = useRef(null);
  // Navegadores muy viejos / entorno de tests: mostramos sin animar.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || visible) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold }
    );
    observador.observe(nodo);

    return () => observador.disconnect();
  }, [threshold, visible]);

  return [ref, visible];
}
