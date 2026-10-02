import { formatearPrecio, calcularDescuento } from '../data/formato.js';

/* Tarjeta de producto. El botón alterna entre "Agregar al carrito" y
   "En el carrito" según si el producto ya fue agregado. */
export default function TarjetaProducto({ producto, enCarrito, cantidad, onAgregar }) {
  // El botón tiene tres estados: disponible, ya agregado y sin stock
  const descuento = calcularDescuento(producto.precio, producto.precioAnterior);
  const sinStock = producto.stock === 0;
  const topeAlcanzado = cantidad >= producto.stock;

  return (
    <article className="tarjeta">
      <div className="tarjeta__portada">
        <img
          src={`${import.meta.env.BASE_URL}${producto.imagen}`}
          alt={`Portada de ${producto.nombre}`}
          width="400"
          height="260"
          loading="lazy"
        />
        {descuento > 0 && <span className="cinta">-{descuento}%</span>}
      </div>

      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__nombre">{producto.nombre}</h3>
        <p className="tarjeta__descripcion">{producto.descripcion}</p>

        <ul className="etiquetas">
          <li className="etiqueta etiqueta--plataforma">{producto.plataforma}</li>
          <li className="etiqueta">{producto.genero}</li>
          <li className="etiqueta">{producto.clasificacion}</li>
        </ul>

        <p className="precios">
          <span className="precio-oferta">{formatearPrecio(producto.precio)}</span>
          <span className="precio-normal">{formatearPrecio(producto.precioAnterior)}</span>
        </p>

        <button
          type="button"
          className={`boton boton--principal${enCarrito ? ' esta-en-carrito' : ''}`}
          onClick={() => onAgregar(producto)}
          disabled={sinStock || topeAlcanzado}
        >
          {sinStock
            ? 'Sin stock'
            : topeAlcanzado
              ? `Sin más stock (${cantidad})`
              : enCarrito
                ? `En el carrito (${cantidad})`
                : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
