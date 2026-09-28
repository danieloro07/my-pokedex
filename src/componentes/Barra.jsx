import estilos from "./Barra.module.css";

/** Cabecera sticky. El `ref` lo usa <App> para medir su alto (--barra). */
export default function Barra({ ref, children }) {
  return (
    <header ref={ref} className={estilos.barra}>
      <span className={estilos.marca}>Pokédex</span>
      {children}
    </header>
  );
}
