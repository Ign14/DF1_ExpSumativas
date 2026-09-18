/* =====================================================================
   carrito.js - Estado y render del carrito de compras
   PixelPlay Store | Sumativa Semana 6 - PFY2201

   Mantiene las líneas del carrito en memoria y las refleja en el DOM:
   detalle de productos, contador de la barra de navegación y totales.
   Toda modificación pasa por una sola función de render, de modo que la
   vista nunca queda desincronizada del estado.
   ===================================================================== */

window.PP = window.PP || {};

PP.carrito = (function () {
  'use strict';

  const u = PP.utilidades;

  const DESPACHO = 3990;          // Costo de envío estándar
  const ENVIO_GRATIS_DESDE = 49990; // Monto que libera el despacho

  // Estado: cada línea es { producto, cantidad }
  let lineas = [];

  // Referencias al DOM, resueltas una sola vez en iniciar()
  let refs = {};

  /* ---------- Operaciones sobre el estado ---------- */

  /** Busca la línea de un producto por su id. */
  function buscarLinea(id) {
    return lineas.find(function (linea) {
      return linea.producto.id === id;
    });
  }

  /**
   * Agrega un producto o incrementa su cantidad si ya estaba en el carrito.
   * Respeta el stock declarado en el JSON.
   */
  function agregar(producto) {
    const linea = buscarLinea(producto.id);
    const stock = Number(producto.stock) || 99;

    if (linea) {
      if (linea.cantidad >= stock) {
        u.notificar('Solo quedan ' + stock + ' unidades de ' + producto.nombre, 'warning');
        return false;
      }
      linea.cantidad += 1;
    } else {
      lineas.push({ producto: producto, cantidad: 1 });
    }

    render();
    return true;
  }

  /** Descuenta una unidad y elimina la línea si llega a cero. */
  function quitar(id) {
    const linea = buscarLinea(id);
    if (!linea) return;

    linea.cantidad -= 1;
    if (linea.cantidad <= 0) {
      lineas = lineas.filter(function (item) {
        return item.producto.id !== id;
      });
    }
    render();
  }

  /** Elimina por completo una línea del carrito. */
  function eliminar(id) {
    lineas = lineas.filter(function (linea) {
      return linea.producto.id !== id;
    });
    render();
  }

  /** Deja el carrito sin líneas. */
  function vaciar() {
    lineas = [];
    render();
  }

  /* ---------- Cálculos derivados ---------- */

  /**
   * Devuelve los totales del carrito. Se recalcula siempre desde el estado
   * para que no existan cifras almacenadas que puedan quedar desfasadas.
   */
  function calcularTotales() {
    const unidades = lineas.reduce(function (suma, linea) {
      return suma + linea.cantidad;
    }, 0);

    const subtotal = lineas.reduce(function (suma, linea) {
      return suma + linea.producto.precio * linea.cantidad;
    }, 0);

    const despacho = (unidades === 0 || subtotal >= ENVIO_GRATIS_DESDE) ? 0 : DESPACHO;

    return {
      unidades: unidades,
      subtotal: subtotal,
      despacho: despacho,
      total: subtotal + despacho
    };
  }

  /* ---------- Render ---------- */

  /** Construye el HTML de una línea del carrito. */
  function plantillaLinea(linea) {
    const p = linea.producto;
    const importe = p.precio * linea.cantidad;

    return [
      '<li class="carrito-item d-flex flex-wrap align-items-center gap-3 py-3">',
      '  <img src="' + u.escapar(p.imagen) + '" alt="" class="carrito-miniatura" width="72" height="48">',
      '  <div class="flex-grow-1" style="min-width: 10rem;">',
      '    <p class="fw-semibold mb-0">' + u.escapar(p.nombre) + '</p>',
      '    <p class="small text-white-50 mb-0">' + u.escapar(p.plataforma || '') + ' &middot; ' + u.formatearPrecio(p.precio) + ' c/u</p>',
      '  </div>',
      '  <div class="btn-group btn-group-sm" role="group" aria-label="Cantidad de ' + u.escapar(p.nombre) + '">',
      '    <button type="button" class="btn btn-outline-light" data-accion="quitar" data-id="' + p.id + '" aria-label="Quitar una unidad de ' + u.escapar(p.nombre) + '">&minus;</button>',
      '    <span class="btn btn-outline-light disabled text-white" aria-live="polite">' + linea.cantidad + '</span>',
      '    <button type="button" class="btn btn-outline-light" data-accion="sumar" data-id="' + p.id + '" aria-label="Agregar una unidad de ' + u.escapar(p.nombre) + '">+</button>',
      '  </div>',
      '  <p class="fw-bold mb-0 text-end" style="min-width: 6rem;">' + u.formatearPrecio(importe) + '</p>',
      '  <button type="button" class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="' + p.id + '" aria-label="Eliminar ' + u.escapar(p.nombre) + ' del carrito">Eliminar</button>',
      '</li>'
    ].join('\n');
  }

  /** HTML mostrado cuando todavía no hay productos agregados. */
  function plantillaVacio() {
    return [
      '<div class="carrito-vacio text-center p-4">',
      '  <p class="fw-semibold mb-1">Tu carrito está vacío</p>',
      '  <p class="text-white-50 mb-3">Agrega productos desde el catálogo para ver aquí el resumen de tu compra.</p>',
      '  <a href="#catalogo" class="btn btn-info btn-sm">Ir al catálogo</a>',
      '</div>'
    ].join('\n');
  }

  /**
   * Vuelca el estado completo en el DOM: detalle, contador y totales.
   * Es la única función que escribe en la interfaz del carrito.
   */
  function render() {
    const totales = calcularTotales();

    // Detalle de líneas
    if (refs.detalle) {
      refs.detalle.innerHTML = lineas.length === 0
        ? plantillaVacio()
        : '<ul class="list-unstyled mb-0">' + lineas.map(plantillaLinea).join('\n') + '</ul>';
    }

    // Contador de la barra de navegación
    if (refs.contador) {
      refs.contador.textContent = totales.unidades;
    }

    // Totales de la columna lateral
    if (refs.unidades) refs.unidades.textContent = totales.unidades;
    if (refs.subtotal) refs.subtotal.textContent = u.formatearPrecio(totales.subtotal);
    if (refs.despacho) {
      refs.despacho.textContent = totales.despacho === 0 && totales.unidades > 0
        ? 'Gratis'
        : u.formatearPrecio(totales.despacho);
    }
    if (refs.total) refs.total.textContent = u.formatearPrecio(totales.total);

    // Los botones de acción solo tienen sentido con productos cargados
    const vacio = totales.unidades === 0;
    if (refs.btnPagar) refs.btnPagar.disabled = vacio;
    if (refs.btnVaciar) refs.btnVaciar.disabled = vacio;
  }

  /* ---------- Eventos ---------- */

  /**
   * Un único listener en el contenedor atiende los botones de todas las
   * líneas (delegación de eventos): funciona también para las que se
   * agreguen después, sin volver a registrar listeners.
   */
  function registrarEventos() {
    if (refs.detalle) {
      refs.detalle.addEventListener('click', function (evento) {
        const boton = evento.target.closest('[data-accion]');
        if (!boton) return;

        const id = Number(boton.dataset.id);
        const accion = boton.dataset.accion;

        if (accion === 'quitar') {
          quitar(id);
        } else if (accion === 'eliminar') {
          eliminar(id);
          u.notificar('Producto eliminado del carrito', 'secondary');
        } else if (accion === 'sumar') {
          const linea = buscarLinea(id);
          if (linea) agregar(linea.producto);
        }
      });
    }

    if (refs.btnVaciar) {
      refs.btnVaciar.addEventListener('click', function () {
        vaciar();
        u.notificar('Carrito vaciado', 'secondary');
      });
    }

    if (refs.btnPagar) {
      refs.btnPagar.addEventListener('click', function () {
        const totales = calcularTotales();
        u.notificar('Compra simulada por ' + u.formatearPrecio(totales.total) + '. Gracias por preferirnos.', 'success');
        vaciar();
      });
    }
  }

  /** Resuelve las referencias del DOM, engancha eventos y pinta el estado inicial. */
  function iniciar() {
    refs = {
      detalle: u.$('#detalleCarrito'),
      contador: u.$('#contadorCarrito'),
      unidades: u.$('#totalUnidades'),
      subtotal: u.$('#totalSubtotal'),
      despacho: u.$('#totalDespacho'),
      total: u.$('#totalGeneral'),
      btnPagar: u.$('#btnPagar'),
      btnVaciar: u.$('#btnVaciar')
    };

    registrarEventos();
    render();
  }

  return {
    iniciar: iniciar,
    agregar: agregar,
    quitar: quitar,
    eliminar: eliminar,
    vaciar: vaciar,
    calcularTotales: calcularTotales
  };
})();
