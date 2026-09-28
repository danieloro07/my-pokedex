import Chip from "./Chip.jsx";
import estilos from "./Atajos.module.css";

/** Pokémon de ejemplo para que la pantalla de inicio no esté vacía. */
export default function Atajos({ nombres, onElegir }) {
  return (
    <div className={estilos.atajos}>
      <span className={estilos.rotulo}>Prueba con</span>
      {nombres.map((nombre) => (
        <Chip key={nombre} onClick={() => onElegir(nombre)}>
          {nombre}
        </Chip>
      ))}
    </div>
  );
}
