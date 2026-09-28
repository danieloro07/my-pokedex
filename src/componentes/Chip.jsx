import estilos from "./Chip.module.css";

/** Pastilla clicable: la usan los atajos y las sugerencias. */
export default function Chip({ children, onClick }) {
  return (
    <button type="button" className={estilos.chip} onClick={onClick}>
      {children}
    </button>
  );
}
