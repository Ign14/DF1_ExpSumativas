import TarjetaProducto from './TarjetaProducto.jsx';

/* Cuadrícula del catálogo. Cubre los tres estados de la carga —cargando,
   error y datos— y el caso de que los filtros no dejen ningún producto. */
/* Cuatro vistas posibles según el estado de la carga y de los filtros:
   cargando, error, sin resultados y la cuadrícula con datos. */
export default function Catalogo({
  productos,
  cargando,
  error,
  onReintentar,
  estaEnCarrito,
  cantidadDe,
  onAgregar,
  onLimpiarFiltros
}) {
  if (cargando) {
    return (
      <div className="estado">
        <span className="girador" aria-hidden="true" />
        <p>Cargando el catálogo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estado estado--error" role="alert">
        <p className="estado__titulo">No pudimos cargar el catálogo</p>
        <p>{error}</p>
        <button type="button" className="boton boton--principal" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="estado">
        <p className="estado__titulo">Sin resultados</p>
        <p>Ningún producto coincide con los filtros aplicados.</p>
        <button type="button" className="boton boton--principal" onClick={onLimpiarFiltros}>
          Ver todo el catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="rejilla">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          enCarrito={estaEnCarrito(producto.id)}
          cantidad={cantidadDe(producto.id)}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}
