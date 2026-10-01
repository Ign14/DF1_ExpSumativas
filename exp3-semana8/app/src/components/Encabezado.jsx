/* Barra superior con el contador de unidades del carrito. */
export default function Encabezado({ unidades, onIrAlCarrito }) {
  return (
    <header className="encabezado">
      <div className="contenedor encabezado__barra">
        <a className="marca" href="#catalogo">
          <img src={`${import.meta.env.BASE_URL}img/logo.svg`} alt="" width="40" height="40" />
          <span>
            PixelPlay <strong>Store</strong>
          </span>
        </a>

        <button type="button" className="boton boton--carrito" onClick={onIrAlCarrito}>
          Carrito
          <span className="contador" aria-live="polite">
            {unidades}
          </span>
        </button>
      </div>
    </header>
  );
}
