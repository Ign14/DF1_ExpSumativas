/* =====================================================================
   app.js - Punto de entrada de la aplicación
   PixelPlay Store | Sumativa Semana 6 - PFY2201

   Coordina los módulos: inicializa carrito y catálogo, dispara la carga
   de datos con la Fetch API y decide qué mostrar cuando algo falla.
   No manipula el DOM directamente: delega en los módulos especializados.
   ===================================================================== */

window.PP = window.PP || {};

PP.app = (function () {
  'use strict';

  const u = PP.utilidades;

  /**
   * Pide el catálogo y resuelve los dos caminos posibles de la promesa.
   * Se invoca al arrancar y cada vez que el usuario pulsa «Reintentar».
   */
  function cargarCatalogo() {
    PP.catalogo.mostrarCargando();

    PP.datos.obtenerProductos()
      .then(function (productos) {
        // Camino feliz: los datos llegaron y pasaron la validación
        PP.catalogo.establecerProductos(productos);
        u.notificar('Catálogo cargado: ' + productos.length + ' productos', 'success');
      })
      .catch(function (error) {
        // Camino de error: se informa al usuario en lenguaje claro
        console.error('[PixelPlay] Error al cargar el catálogo:', error);
        mostrarErrorDeCarga(error);
      });
  }

  /**
   * Pinta el mensaje amigable de error con dos salidas para el usuario:
   * reintentar la descarga o ver un catálogo de demostración.
   */
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

  /** Arranque: prepara los módulos y lanza la carga de datos. */
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

// Se espera a que el DOM esté disponible antes de tocar sus elementos.
document.addEventListener('DOMContentLoaded', PP.app.iniciar);
