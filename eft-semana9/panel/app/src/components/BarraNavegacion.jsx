/* Barra de navegación. Recibe por props el total visible y el total cargado
   para mostrar el contador sin conocer la lista completa. */
export default function BarraNavegacion({ visibles, total, onVerTodo }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark barra-principal sticky-top" aria-label="Navegación del catálogo en React">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="../">
          <img src="img/logo.svg" alt="" width="36" height="36" />
          <span className="fw-bold">
            PixelPlay <span className="text-pixel">React</span>
          </span>
        </a>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="contador-catalogo" role="status" aria-live="polite">
            {visibles} de {total} en lista
          </span>
          <button className="btn btn-sm btn-outline-light boton-barra" type="button" onClick={onVerTodo}>
            Ver todo
          </button>
          <a className="btn btn-sm btn-pixel boton-barra" href="../">
            Volver a la tienda
          </a>
        </div>
      </div>
    </nav>
  );
}
