/* carrito.js - Estado del carrito y su reflejo en el DOM. */

window.PP = window.PP || {};

PP.carrito = (function () {
  'use strict';

  const u = PP.utilidades;

  const DESPACHO = 3990;          // Costo de envío estándar
  const ENVIO_GRATIS_DESDE = 49990; // Monto que libera el despacho

  // Estado: cada línea es { producto, cantidad }
  let lineas = [];

  let refs = {};

  /* ---------- Operaciones sobre el estado ---------- */

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

  function eliminar(id) {
    lineas = lineas.filter(function (linea) {
      return linea.producto.id !== id;
    });
    render();
  }

  function vaciar() {
    lineas = [];
    render();
  }

  /* ---------- Cálculos derivados ---------- */

  /** Se recalcula desde el estado en cada render: no se guardan totales. */
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

  function plantillaVacio() {
    return [
      '<div class="carrito-vacio text-center p-4">',
      '  <p class="fw-semibold mb-1">Tu carrito está vacío</p>',
      '  <p class="text-white-50 mb-3">Agrega productos desde el catálogo para ver aquí el resumen de tu compra.</p>',
      '  <a href="#catalogo" class="btn btn-info btn-sm">Ir al catálogo</a>',
      '</div>'
    ].join('\n');
  }

  /** Única función que escribe en la interfaz del carrito. */
  function render() {
    const totales = calcularTotales();

    if (refs.detalle) {
      refs.detalle.innerHTML = lineas.length === 0
        ? plantillaVacio()
        : '<ul class="list-unstyled mb-0">' + lineas.map(plantillaLinea).join('\n') + '</ul>';
    }

    if (refs.contador) {
      refs.contador.textContent = totales.unidades;
    }

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

  /* Delegación de eventos: un listener en el contenedor cubre las líneas
     que se creen después, sin volver a registrar nada. */
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
