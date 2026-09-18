/* =====================================================================
   catalogo.js - Render del catálogo, filtros y buscador
   PixelPlay Store | Sumativa Semana 6 - PFY2201

   Recibe los productos ya validados por datos.js y se encarga de pintarlos
   como tarjetas de Bootstrap, aplicar el filtro por categoría y resolver
   la búsqueda enviada desde el formulario de la barra de navegación.
   ===================================================================== */

window.PP = window.PP || {};

PP.catalogo = (function () {
  'use strict';

  const u = PP.utilidades;

  // Estado de la vista: productos cargados y criterios activos
  let productos = [];
  let categoriaActiva = 'todos';
  let terminoBusqueda = '';

  let refs = {};

  /* ---------- Plantillas ---------- */

  /** Tarjeta de Bootstrap para un producto. */
  function plantillaTarjeta(producto) {
    const descuento = u.calcularDescuento(producto.precio, producto.precioAnterior);
    const sinStock = Number(producto.stock) === 0;

    return [
      '<div class="col">',
      '  <article class="card h-100 shadow-sm producto-card position-relative">',
      descuento > 0
        ? '    <span class="badge text-bg-danger producto-cinta">-' + descuento + '%</span>'
        : '',
      '    <img src="' + u.escapar(producto.imagen) + '" class="card-img-top"',
      '         alt="Portada de ' + u.escapar(producto.nombre) + '" width="400" height="260" loading="lazy">',
      '    <div class="card-body d-flex flex-column">',
      '      <h3 class="h5 card-title">' + u.escapar(producto.nombre) + '</h3>',
      '      <p class="card-text small text-body-secondary flex-grow-1">' + u.escapar(producto.descripcion) + '</p>',
      '      <p class="mb-2 d-flex flex-wrap gap-1">',
      '        <span class="badge text-bg-primary">' + u.escapar(producto.plataforma) + '</span>',
      '        <span class="badge text-bg-light border">' + u.escapar(producto.genero) + '</span>',
      '        <span class="badge text-bg-light border">' + u.escapar(producto.clasificacion) + '</span>',
      '      </p>',
      '      <p class="mb-3 d-flex align-items-baseline gap-2">',
      '        <span class="producto-precio">' + u.formatearPrecio(producto.precio) + '</span>',
      producto.precioAnterior
        ? '        <span class="producto-precio-anterior text-body-secondary">' + u.formatearPrecio(producto.precioAnterior) + '</span>'
        : '',
      '      </p>',
      '      <button type="button" class="btn btn-info w-100 mt-auto" data-accion="agregar"',
      '              data-id="' + producto.id + '"' + (sinStock ? ' disabled' : '') + '>',
      sinStock ? 'Sin stock' : 'Agregar al carrito',
      '      </button>',
      '    </div>',
      '  </article>',
      '</div>'
    ].filter(Boolean).join('\n');
  }

  /** Esqueletos mostrados mientras se resuelve la promesa de fetch. */
  function plantillaEsqueletos(cantidad) {
    let html = '';
    for (let i = 0; i < cantidad; i++) {
      html += [
        '<div class="col">',
        '  <div class="card h-100 shadow-sm" aria-hidden="true">',
        '    <div class="esqueleto esqueleto-img"></div>',
        '    <div class="card-body">',
        '      <div class="esqueleto mb-2" style="height: 1.25rem; width: 70%;"></div>',
        '      <div class="esqueleto mb-2" style="height: .75rem;"></div>',
        '      <div class="esqueleto mb-3" style="height: .75rem; width: 85%;"></div>',
        '      <div class="esqueleto" style="height: 2.5rem;"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');
    }
    return html;
  }

  /* ---------- Filtrado ---------- */

  /**
   * Aplica en cadena el filtro de categoría y el término de búsqueda.
   * La búsqueda ignora mayúsculas y acentos para ser tolerante al tipeo.
   */
  function filtrar() {
    const termino = normalizar(terminoBusqueda);

    return productos.filter(function (producto) {
      const coincideCategoria = categoriaActiva === 'todos' || producto.categoria === categoriaActiva;
      if (!coincideCategoria) return false;

      if (!termino) return true;

      const texto = normalizar([
        producto.nombre, producto.plataforma, producto.genero, producto.descripcion
      ].join(' '));

      return texto.indexOf(termino) !== -1;
    });
  }

  /** Pasa a minúsculas y elimina los acentos para comparar textos. */
  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  /* ---------- Render ---------- */

  /** Pinta la cuadrícula según los filtros activos y actualiza el resumen. */
  function render() {
    const visibles = filtrar();

    if (visibles.length === 0) {
      refs.grid.innerHTML = '';
      u.mostrarAviso(
        refs.avisos,
        'warning',
        'Sin resultados',
        'No encontramos productos que coincidan con tu búsqueda. Prueba con otro término o vuelve al catálogo completo.',
        '<button type="button" class="btn btn-sm btn-dark" id="btnLimpiarFiltros">Ver todo el catálogo</button>'
      );
      const limpiar = u.$('#btnLimpiarFiltros');
      if (limpiar) limpiar.addEventListener('click', reiniciarFiltros);
    } else {
      refs.grid.innerHTML = visibles.map(plantillaTarjeta).join('\n');
      if (terminoBusqueda) {
        u.mostrarAviso(
          refs.avisos,
          'info',
          visibles.length + (visibles.length === 1 ? ' resultado' : ' resultados') + ' para "' + u.escapar(terminoBusqueda) + '"',
          'Puedes combinar la búsqueda con los filtros por categoría.',
          '<button type="button" class="btn btn-sm btn-dark" id="btnLimpiarFiltros">Limpiar búsqueda</button>'
        );
        const limpiar = u.$('#btnLimpiarFiltros');
        if (limpiar) limpiar.addEventListener('click', reiniciarFiltros);
      } else {
        u.limpiarAvisos(refs.avisos);
      }
    }

    actualizarResumen(visibles.length);
  }

  /** Texto bajo el título del catálogo con el conteo de productos visibles. */
  function actualizarResumen(cantidad) {
    if (!refs.resumen) return;

    // Cada texto incluye su propia preposición para que la frase concuerde
    const nombreCategoria = {
      todos: 'del catálogo completo',
      juegos: 'de la categoría Videojuegos',
      accesorios: 'de la categoría Accesorios'
    }[categoriaActiva] || 'del catálogo';

    refs.resumen.textContent = cantidad === 0
      ? 'Sin productos para mostrar ' + nombreCategoria + '.'
      : 'Mostrando ' + cantidad + (cantidad === 1 ? ' producto ' : ' productos ') + nombreCategoria + '.';
  }

  /** Marca visualmente el botón de la categoría seleccionada. */
  function marcarFiltroActivo() {
    if (!refs.filtros) return;
    u.$$('[data-categoria]', refs.filtros).forEach(function (boton) {
      boton.classList.toggle('active', boton.dataset.categoria === categoriaActiva);
      boton.setAttribute('aria-pressed', boton.dataset.categoria === categoriaActiva ? 'true' : 'false');
    });
  }

  /* ---------- Acciones publicas ---------- */

  /** Cambia la categoría activa y vuelve a pintar. */
  function filtrarPorCategoria(categoria) {
    categoriaActiva = categoria || 'todos';
    marcarFiltroActivo();
    render();
  }

  /** Aplica un término de búsqueda sobre el catálogo. */
  function buscar(termino) {
    terminoBusqueda = String(termino || '').trim();
    render();
  }

  /** Vuelve al estado inicial: catálogo completo y sin búsqueda. */
  function reiniciarFiltros() {
    terminoBusqueda = '';
    categoriaActiva = 'todos';
    if (refs.inputBusqueda) {
      refs.inputBusqueda.value = '';
      refs.inputBusqueda.classList.remove('is-invalid');
    }
    marcarFiltroActivo();
    render();
  }

  /** Muestra los esqueletos de carga antes de resolver la peticion. */
  function mostrarCargando() {
    refs.grid.innerHTML = plantillaEsqueletos(6);
    if (refs.resumen) refs.resumen.textContent = 'Cargando el catálogo desde ' + PP.datos.RUTA_JSON + '...';
  }

  /** Recibe los productos descargados y pinta el catálogo. */
  function establecerProductos(lista) {
    productos = lista;
    reiniciarFiltros();
  }

  /* ---------- Eventos ---------- */

  function registrarEventos() {
    // Evento click: agregar al carrito. Un solo listener sobre la cuadrícula
    // atiende todas las tarjetas, incluidas las que se creen después.
    refs.grid.addEventListener('click', function (evento) {
      const boton = evento.target.closest('[data-accion="agregar"]');
      if (!boton) return;

      const id = Number(boton.dataset.id);
      const producto = productos.find(function (item) { return item.id === id; });
      if (!producto) return;

      if (PP.carrito.agregar(producto)) {
        u.notificar(producto.nombre + ' se agregó al carrito', 'success');
      }
    });

    // Evento click: filtros por categoría
    if (refs.filtros) {
      refs.filtros.addEventListener('click', function (evento) {
        const boton = evento.target.closest('[data-categoria]');
        if (!boton) return;
        filtrarPorCategoria(boton.dataset.categoria);
      });
    }

    // Evento submit: formulario de búsqueda con validación mínima
    if (refs.formBusqueda) {
      refs.formBusqueda.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const valor = refs.inputBusqueda.value.trim();

        if (valor.length > 0 && valor.length < 2) {
          refs.inputBusqueda.classList.add('is-invalid');
          u.notificar('Escribe al menos dos caracteres para buscar', 'warning');
          return;
        }

        refs.inputBusqueda.classList.remove('is-invalid');
        buscar(valor);

        // Lleva la vista al catálogo para que el usuario vea el resultado
        const seccion = u.$('#catalogo');
        if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Los enlaces de categoría de la barra de navegación también filtran
    u.$$('.navbar [data-categoria], .carousel [data-categoria]').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        filtrarPorCategoria(enlace.dataset.categoria);
      });
    });
  }

  /** Resuelve referencias del DOM y engancha los eventos del catálogo. */
  function iniciar() {
    refs = {
      grid: u.$('#gridProductos'),
      avisos: u.$('#zonaAvisos'),
      resumen: u.$('#resumenCatalogo'),
      filtros: u.$('#filtrosCategoria'),
      formBusqueda: u.$('#formBusqueda'),
      inputBusqueda: u.$('#inputBusqueda')
    };

    registrarEventos();
  }

  return {
    iniciar: iniciar,
    mostrarCargando: mostrarCargando,
    establecerProductos: establecerProductos,
    filtrarPorCategoria: filtrarPorCategoria,
    buscar: buscar,
    reiniciarFiltros: reiniciarFiltros
  };
})();
