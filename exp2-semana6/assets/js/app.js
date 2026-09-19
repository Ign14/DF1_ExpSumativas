/* app.js - Punto de entrada: inicializa los módulos y pide el catálogo. */

window.PP = window.PP || {};

PP.app = (function () {
  'use strict';

  const u = PP.utilidades;

  /** Se invoca al arrancar y desde el botón Reintentar. */
  function cargarCatalogo() {
    PP.catalogo.mostrarCargando();

    PP.datos.obtenerProductos()
      .then(function (productos) {
        PP.catalogo.establecerProductos(productos);
        u.notificar('Catálogo cargado: ' + productos.length + ' productos', 'success');
      })
      .catch(function (error) {
        console.error('[PixelPlay] Error al cargar el catálogo:', error);
        mostrarErrorDeCarga(error);
      });
  }

  /** Mensaje de error con dos salidas: reintentar o ver datos de respaldo. */
  function mostrarErrorDeCarga(error) {
    const info = PP.datos.describirError(error);
    const avisos = u.$('#zonaAvisos');
    const grid = u.$('#gridProductos');
    const resumen = u.$('#resumenCatalogo');

    if (grid) grid.innerHTML = '';
    if (resumen) resumen.textContent = 'No fue posible mostrar el catálogo.';

    u.mostrarAviso(
      avisos,
      'danger',
      info.titulo,
      info.detalle,
      '<button type="button" class="btn btn-sm btn-danger" id="btnReintentar">Reintentar</button>' +
      '<button type="button" class="btn btn-sm btn-outline-danger" id="btnRespaldo">Ver catálogo de demostración</button>'
    );

    const btnReintentar = u.$('#btnReintentar');
    if (btnReintentar) {
      btnReintentar.addEventListener('click', cargarCatalogo);
    }

    const btnRespaldo = u.$('#btnRespaldo');
    if (btnRespaldo) {
      btnRespaldo.addEventListener('click', function () {
        PP.catalogo.establecerProductos(PP.datos.PRODUCTOS_RESPALDO);
        u.mostrarAviso(
          avisos,
          'warning',
          'Estás viendo un catálogo de demostración',
          'Son datos de respaldo incluidos en <code>assets/js/datos.js</code>, no los del archivo JSON. ' +
          'Publica el sitio o usa un servidor local para cargar el catálogo completo.',
          '<button type="button" class="btn btn-sm btn-dark" id="btnReintentar2">Reintentar la carga real</button>'
        );
        const reintentar2 = u.$('#btnReintentar2');
        if (reintentar2) reintentar2.addEventListener('click', cargarCatalogo);
      });
    }
  }

  function iniciar() {
    PP.carrito.iniciar();
    PP.catalogo.iniciar();
    cargarCatalogo();
  }

  return {
    iniciar: iniciar,
    cargarCatalogo: cargarCatalogo
  };
})();

document.addEventListener('DOMContentLoaded', PP.app.iniciar);
