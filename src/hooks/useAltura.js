import { useCallback, useEffect, useState } from "react";

/**
 * Mide el alto real de un elemento y lo vuelve a medir cuando cambia
 * (resize, salto de línea en móvil…). Sustituye a medirBarra().
 *
 * Devuelve una "callback ref": funciona aunque el elemento aparezca y
 * desaparezca (la barra solo existe cuando hay pokémon).
 *
 *   const [refBarra, altoBarra] = useAltura();
 *   <header ref={refBarra}>
 */
export function useAltura() {
  const [nodo, setNodo] = useState(null);
  const [alto, setAlto] = useState(0);
  const ref = useCallback((el) => setNodo(el), []);

  useEffect(() => {
    if (!nodo) return;
    const medir = () => setAlto(nodo.offsetHeight);
    medir();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", medir);
      return () => window.removeEventListener("resize", medir);
    }
    const observador = new ResizeObserver(medir);
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [nodo]);

  return [ref, nodo ? alto : 0];
}
