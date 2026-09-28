import { useEffect, useState } from "react";

function calcularProgreso() {
  if (typeof window === "undefined" || window.innerHeight === 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
}

/**
 * Convierte "cuánto has bajado" en un número de 0 a 1.
 * requestAnimationFrame evita recalcular más veces de las que la pantalla dibuja.
 */
export function useProgresoScroll() {
  const [progreso, setProgreso] = useState(calcularProgreso);

  useEffect(() => {
    let frame = 0;
    const alMover = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setProgreso(calcularProgreso());
      });
    };

    alMover(); // valor inicial por si el navegador restauró el scroll
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);

    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
      cancelAnimationFrame(frame);
    };
  }, []);

  return progreso;
}
