import { formatearPrecio } from '../data/formato.js';

/* Resumen del carrito. Con el carrito vacío muestra un mensaje en lugar de
   la tabla; con productos, el detalle y los totales. */
export default function Carrito({ lineas, totales, onSumar, onQuitar, onEliminar, onVaciar, envioGratisDesde }) {
  if (lineas.length === 0) {
    return (
      <section className="carrito" id="carrito">
        <h2>Resumen de tu carrito</h2>
        <div className="carrito__vacio">
          <p className="estado__titulo">Tu carrito está vacío</p>
          <p>Agrega productos desde el catálogo para ver aquí el resumen de tu compra.</p>
          <a className="boton boton--principal" href="#catalogo">
            Ir al catálogo
          </a>
        </div>
      </section>
    );
  }

  const faltaParaEnvioGratis = envioGratisDesde - totales.subtotal;

  return (
    <section className="carrito" id="carrito">
      <h2>Resumen de tu carrito</h2>

      <div className="carrito__columnas">
        <ul className="carrito__lineas">
          {lineas.map(({ producto, cantidad }) => (
            <li key={producto.id} className="carrito__linea">
              <img
                src={`${import.meta.env.BASE_URL}${producto.imagen}`}
                alt=""
                className="carrito__miniatura"
                width="72"
                height="48"
              />

              <div className="carrito__datos">
                <p className="carrito__nombre">{producto.nombre}</p>
                <p className="carrito__unitario">
                  {producto.plataforma} · {formatearPrecio(producto.precio)} c/u
                </p>
              </div>

              <div className="cantidad" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
                <button
                  type="button"
                  className="boton boton--cantidad"
                  onClick={() => onQuitar(producto.id)}
                  aria-label={`Quitar una unidad de ${producto.nombre}`}
                >
                  −
                </button>
                <span aria-live="polite">{cantidad}</span>
                <button
                  type="button"
                  className="boton boton--cantidad"
                  onClick={() => onSumar(producto)}
                  aria-label={`Agregar una unidad de ${producto.nombre}`}
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>

              <p className="carrito__importe">{formatearPrecio(producto.precio * cantidad)}</p>

              <button
                type="button"
                className="boton boton--eliminar"
                onClick={() => onEliminar(producto.id)}
                aria-label={`Eliminar ${producto.nombre} del carrito`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <aside className="totales">
          <h3>Total de la compra</h3>

          <dl>
            <dt>Productos</dt>
            <dd>{totales.unidades}</dd>

            <dt>Subtotal</dt>
            <dd>{formatearPrecio(totales.subtotal)}</dd>

            <dt>Despacho</dt>
            <dd>{totales.despacho === 0 ? 'Gratis' : formatearPrecio(totales.despacho)}</dd>
          </dl>

          <p className="totales__total">
            <span>Total</span>
            <strong>{formatearPrecio(totales.total)}</strong>
          </p>

          {totales.ahorro > 0 && (
            <p className="totales__ahorro">Estás ahorrando {formatearPrecio(totales.ahorro)}</p>
          )}

          {totales.despacho > 0 && (
            <p className="totales__aviso">
              Te faltan {formatearPrecio(faltaParaEnvioGratis)} para el envío gratis.
            </p>
          )}

          <button type="button" className="boton boton--vaciar" onClick={onVaciar}>
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}
