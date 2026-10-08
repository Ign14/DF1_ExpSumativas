/* Controles de filtrado. No guarda estado propio: lo recibe y lo devuelve al
   componente App mediante las funciones que llegan por props. */
export default function Filtros({ categorias, categoriaActiva, busqueda, onCambiarCategoria, onBuscar }) {
  return (
    <section className="panel-filtros" aria-labelledby="titulo-filtros">
      <h2 className="h6 fw-semibold" id="titulo-filtros">Filtrar el catálogo</h2>

      <div className="row g-3 align-items-end">
        <div className="col-lg-8">
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
            <button
              type="button"
              className="filtro-categoria"
              aria-pressed={categoriaActiva === 'todas'}
              onClick={() => onCambiarCategoria('todas')}
            >
              Todas
            </button>

            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className="filtro-categoria"
                aria-pressed={categoriaActiva === categoria}
                onClick={() => onCambiarCategoria(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          <label className="form-label fw-semibold" htmlFor="buscadorReact">Buscar</label>
          <input
            className="form-control"
            type="search"
            id="buscadorReact"
            placeholder="Nombre, plataforma o categoría"
            autoComplete="off"
            value={busqueda}
            onChange={(evento) => onBuscar(evento.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
