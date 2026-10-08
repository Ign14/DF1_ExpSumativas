const pesos = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

export function formatearPrecio(valor) {
  return pesos.format(valor);
}

/* Quita los acentos para que "accion" encuentre "Acción". */
export function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}
