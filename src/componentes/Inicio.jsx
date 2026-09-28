import estilos from "./Inicio.module.css";

/**
 * Pantalla de bienvenida: maquetación centrada + brillo animado.
 * `children` va en la zona central (buscador + avisos); `pie` debajo (atajos).
 */
export default function Inicio({ children, pie }) {
  return (
    <section className={estilos.intro}>
      <div className={estilos.brillo} aria-hidden="true" />

      <h1 className={estilos.titulo}>POKÉ<br />DEX</h1>
      <p className={estilos.lema}>
        Busca cualquier Pokémon por su nombre o su número y baja para ver todo
        lo que la Pokédex sabe de él.
      </p>

      <div className={estilos.zona}>{children}</div>
      {pie}
    </section>
  );
}
