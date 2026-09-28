import Chip from "./Chip.jsx";
import estilos from "./Avisos.module.css";

/** Mensaje de error / "Buscando…" y los chips "¿quisiste decir?". */
export default function Avisos({ error, cargando, sugerencias, onElegir, enInicio = false }) {
  const mensaje = error
    ? { texto: error, tipo: "error" }
    : cargando
      ? { texto: "Buscando…", tipo: "info" }
      : null;

  if (!mensaje && sugerencias.length === 0) return null;

  return (
    <div className={`${estilos.avisos} ${enInicio ? estilos.enInicio : ""}`}>
      {mensaje && (
        <div
          className={`${estilos.mensaje} ${estilos[mensaje.tipo]}`}
          role={mensaje.tipo === "error" ? "alert" : "status"}
        >
          {mensaje.texto}
        </div>
      )}

      {sugerencias.length > 0 && (
        <div className={estilos.sugerencias}>
          <b>¿Quisiste decir? </b>
          {sugerencias.map((nombre) => (
            <Chip key={nombre} onClick={() => onElegir(nombre)}>
              {nombre}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
