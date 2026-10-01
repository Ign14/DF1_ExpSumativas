/* Formato de moneda chilena, compartido por el catálogo y el carrito. */
const formateador = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

export function formatearPrecio(valor) {
  return formateador.format(valor);
}

export function calcularDescuento(precio, precioNormal) {
  if (!precioNormal || precioNormal <= precio) return 0;
  return Math.round((1 - precio / precioNormal) * 100);
}
