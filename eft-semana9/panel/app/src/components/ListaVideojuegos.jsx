import TarjetaVideojuego from './TarjetaVideojuego.jsx';

/* Renderizado condicional en cuatro estados: carga, error, lista vacía y
   lista con resultados. Cada rama devuelve antes para no evaluar el resto. */
export default function ListaVideojuegos({ juegos, cargando, error, onEliminar, onReintentar, onLimpiar }) {
  if (cargando) {
    return (
      <div className="estado-lista" role="status" aria-live="polite">
        <div className="spinner-border text-primary" aria-hidden="true"></div>
        <p className="mb-0 mt-3">Cargando el catálogo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estado-lista estado-lista--error" role="alert">
        <h3 className="h5">No se pudo cargar el catálogo</h3>
        <p>{error}</p>
        <button className="btn btn-pixel" type="button" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (juegos.length === 0) {
    return (
      <div className="estado-lista">
        <h3 className="h5">Sin resultados</h3>
        <p>Ningún videojuego de la lista coincide con el filtro aplicado.</p>
        <button className="btn btn-pixel" type="button" onClick={onLimpiar}>
          Ver todo el catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
      {juegos.map((juego) => (
        <div className="col" key={juego.id}>
          <TarjetaVideojuego juego={juego} onEliminar={onEliminar} />
        </div>
      ))}
    </div>
  );
}
