/* =====================================================================
   utilidades.js - Funciones auxiliares reutilizables
   PixelPlay Store | Sumativa Semana 6 - PFY2201

   Reúne las operaciones que repiten los demás módulos: selección de
   elementos, formato de moneda, avisos y notificaciones. Al centralizarlas
   aquí se evita duplicar código en catalogo.js y carrito.js.
   ===================================================================== */

// Se expone un único objeto global para no contaminar window con
// decenas de nombres sueltos.
const PP = window.PP || {};
window.PP = PP;

PP.utilidades = (function () {
  'use strict';

  /**
   * Devuelve el primer elemento que coincide con el selector.
   * Atajo de document.querySelector usado por todos los módulos.
   */
  function $(selector, contexto) {
    return (contexto || document).querySelector(selector);
  }

  /**
   * Devuelve un arreglo real (no NodeList) con todas las coincidencias,
   * de modo que se puedan usar map, filter y forEach sin conversiones.
   */
  function $$(selector, contexto) {
    return Array.from((contexto || document).querySelectorAll(selector));
  }

  /**
   * Formatea un número como precio chileno: 39990 -> "$39.990".
   * Se usa tanto en las tarjetas del catálogo como en los totales.
   */
  function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  /**
   * Escapa caracteres peligrosos antes de insertar texto con innerHTML.
   * Evita que un dato del JSON pueda inyectar etiquetas en la página.
   */
  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto == null ? '' : String(texto);
    return div.innerHTML;
  }

  /**
   * Calcula el porcentaje de descuento entre el precio anterior y el actual.
   * Devuelve 0 cuando el producto no está en oferta.
   */
  function calcularDescuento(precio, precioAnterior) {
    if (!precioAnterior || precioAnterior <= precio) return 0;
    return Math.round((1 - precio / precioAnterior) * 100);
  }

  /**
   * Pinta un aviso de Bootstrap dentro del contenedor indicado.
   * tipo admite los sufijos de alert de Bootstrap: info, warning, danger…
   */
  function mostrarAviso(contenedor, tipo, titulo, mensaje, accionesHTML) {
    if (!contenedor) return;
    contenedor.innerHTML = [
      '<div class="alert alert-' + tipo + ' d-flex flex-column gap-2" role="alert">',
      '  <p class="fw-bold mb-0">' + escapar(titulo) + '</p>',
      '  <p class="mb-0">' + mensaje + '</p>',
      accionesHTML ? '  <div class="d-flex flex-wrap gap-2 mt-1">' + accionesHTML + '</div>' : '',
      '</div>'
    ].join('\n');
  }

  /** Vacía el contenedor de avisos. */
  function limpiarAvisos(contenedor) {
    if (contenedor) contenedor.innerHTML = '';
  }

  /**
   * Muestra una notificación emergente (toast de Bootstrap) y la destruye
   * del DOM cuando termina de ocultarse, para no acumular nodos huérfanos.
   */
  function notificar(mensaje, tipo) {
    const zona = $('#zonaToasts');
    if (!zona) return;

    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-bg-' + (tipo || 'dark') + ' border-0';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = [
      '<div class="d-flex">',
      '  <div class="toast-body">' + escapar(mensaje) + '</div>',
      '  <button type="button" class="btn-close btn-close-white me-2 m-auto"',
      '          data-bs-dismiss="toast" aria-label="Cerrar"></button>',
      '</div>'
    ].join('\n');

    zona.appendChild(toast);

    // Si Bootstrap no estuviera disponible, el toast se muestra igual
    // como bloque estático y se retira después de unos segundos.
    if (window.bootstrap && window.bootstrap.Toast) {
      const instancia = new window.bootstrap.Toast(toast, { delay: 2600 });
      toast.addEventListener('hidden.bs.toast', () => toast.remove());
      instancia.show();
    } else {
      toast.classList.add('show');
      setTimeout(() => toast.remove(), 2600);
    }
  }

  // API pública del módulo
  return {
    $: $,
    $$: $$,
    formatearPrecio: formatearPrecio,
    escapar: escapar,
    calcularDescuento: calcularDescuento,
    mostrarAviso: mostrarAviso,
    limpiarAvisos: limpiarAvisos,
    notificar: notificar
  };
})();
