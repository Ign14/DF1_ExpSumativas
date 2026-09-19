/* utilidades.js - Funciones auxiliares compartidas por los demás módulos. */

const PP = window.PP || {};
window.PP = PP;

PP.utilidades = (function () {
  'use strict';

  function $(selector, contexto) {
    return (contexto || document).querySelector(selector);
  }

  function $$(selector, contexto) {
    return Array.from((contexto || document).querySelectorAll(selector));
  }

  function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(valor);
  }

  /** Evita que un dato del JSON inyecte etiquetas al usar innerHTML. */
  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto == null ? '' : String(texto);
    return div.innerHTML;
  }

  function calcularDescuento(precio, precioAnterior) {
    if (!precioAnterior || precioAnterior <= precio) return 0;
    return Math.round((1 - precio / precioAnterior) * 100);
  }

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

  function limpiarAvisos(contenedor) {
    if (contenedor) contenedor.innerHTML = '';
  }

  /** El toast se elimina del DOM al ocultarse para no acumular nodos. */
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
