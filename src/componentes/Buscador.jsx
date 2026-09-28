import estilos from "./Buscador.module.css";

/**
 * Input + botón. Es controlado: el texto vive en <App> porque las
 * sugerencias, los atajos y las evoluciones también lo escriben, y porque
 * el buscador "se muda" de <Inicio> a <Barra> sin perder lo escrito.
 */
export default function Buscador({ variante = "grande", texto, onCambiar, onBuscar, cargando }) {
  function manejarEnvio(evento) {
    evento.preventDefault(); // evita que se recargue la página
    onBuscar(texto);
  }

  return (
    <form
      className={`${estilos.formulario} ${estilos[variante]}`}
      onSubmit={manejarEnvio}
      autoComplete="off"
      role="search"
    >
      <input
        className={estilos.entrada}
        type="text"
        value={texto}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder="nombre o id (ej: charizard, 6)"
        maxLength={30}
        aria-label="Nombre o id del pokémon"
      />
      <button className={estilos.boton} type="submit" disabled={cargando}>
        {cargando ? "…" : "Buscar"}
      </button>
    </form>
  );
}
