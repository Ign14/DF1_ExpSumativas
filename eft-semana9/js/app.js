/* Punto de entrada: localiza los nodos del documento y arranca los dos módulos. */
(function (global) {
  'use strict';

  function arrancar() {
    const datos = global.PixelPlay.datos;

    const catalogo = global.PixelPlay.catalogo.crear({
      rejilla: document.getElementById('rejillaCatalogo'),
      filtros: document.getElementById('filtrosCategoria'),
      resumen: document.getElementById('resumenResultados'),
      vacio: document.getElementById('sinResultados'),
      buscador: document.getElementById('busqueda'),
      juegos: datos.videojuegos,
      categorias: datos.categorias
    });

    catalogo.iniciar();

    document.getElementById('limpiarFiltros').addEventListener('click', function () {
      catalogo.limpiar();
      document.getElementById('busqueda').focus();
    });

    global.PixelPlay.contacto.crear({
      formulario: document.getElementById('formularioContacto'),
      aviso: document.getElementById('avisoFormulario'),
      nombre: document.getElementById('nombre'),
      errorNombre: document.getElementById('errorNombre'),
      email: document.getElementById('email'),
      errorEmail: document.getElementById('errorEmail'),
      mensaje: document.getElementById('mensaje'),
      errorMensaje: document.getElementById('errorMensaje')
    }).iniciar();
  }

  document.addEventListener('DOMContentLoaded', arrancar);
})(window);
