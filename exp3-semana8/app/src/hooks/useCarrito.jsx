import { useState, useMemo } from 'react';

const DESPACHO = 3990;
const ENVIO_GRATIS_DESDE = 49990;

/* Estado del carrito y sus operaciones.
   Las líneas son la única fuente de verdad; los totales se derivan con useMemo
   para no guardar cifras que puedan quedar desfasadas. */
export function useCarrito() {
  const [lineas, setLineas] = useState([]);

  function agregar(producto) {
    setLineas((actuales) => {
      const existente = actuales.find((l) => l.producto.id === producto.id);

      if (!existente) {
        return [...actuales, { producto, cantidad: 1 }];
      }

      if (existente.cantidad >= producto.stock) return actuales;

      return actuales.map((l) =>
        l.producto.id === producto.id ? { ...l, cantidad: l.cantidad + 1 } : l
      );
    });
  }

  function quitar(id) {
    setLineas((actuales) =>
      actuales
        .map((l) => (l.producto.id === id ? { ...l, cantidad: l.cantidad - 1 } : l))
        .filter((l) => l.cantidad > 0)
    );
  }

  function eliminar(id) {
    setLineas((actuales) => actuales.filter((l) => l.producto.id !== id));
  }

  function vaciar() {
    setLineas([]);
  }

  const totales = useMemo(() => {
    const unidades = lineas.reduce((suma, l) => suma + l.cantidad, 0);
    const subtotal = lineas.reduce((suma, l) => suma + l.producto.precio * l.cantidad, 0);
    const ahorro = lineas.reduce(
      (suma, l) => suma + (l.producto.precioAnterior - l.producto.precio) * l.cantidad,
      0
    );
    const despacho = unidades === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : DESPACHO;

    return { unidades, subtotal, ahorro, despacho, total: subtotal + despacho };
  }, [lineas]);

  const estaEnCarrito = (id) => lineas.some((l) => l.producto.id === id);

  return { lineas, agregar, quitar, eliminar, vaciar, totales, estaEnCarrito, ENVIO_GRATIS_DESDE };
}
