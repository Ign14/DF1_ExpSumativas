/* Genera el catálogo en el DOM y mantiene el filtro por categoría y la búsqueda. */
(function (global) {
  'use strict';

  const TODAS = 'todas';

  const pesos = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

  /* Quita los acentos para que "accion" encuentre "Acción". */
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function crearBotonCategoria(etiqueta, valor, activo) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'filtro-categoria';
    boton.dataset.categoria = valor;
    boton.textContent = etiqueta;
    boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
    return boton;
  }

  function crearTarjeta(juego) {
    const columna = document.createElement('div');
    columna.className = 'col';

    const articulo = document.createElement('article');
    articulo.className = 'card tarjeta-juego';
    articulo.dataset.id = String(juego.id);

    const portada = document.createElement('img');
    portada.src = juego.imagen;
    portada.alt = 'Portada de ' + juego.nombre;
    portada.className = 'card-img-top';
    portada.loading = 'lazy';
    portada.width = 400;
    portada.height = 260;

    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body cuerpo-tarjeta';

    const titulo = document.createElement('h3');
    titulo.className = 'card-title';
    titulo.textContent = juego.nombre;

    const meta = document.createElement('div');
    meta.className = 'meta-tarjeta';

    const categoria = document.createElement('span');
    categoria.className = 'badge insignia';
    categoria.textContent = juego.categoria;

    const plataforma = document.createElement('span');
    plataforma.className = 'badge insignia insignia--plataforma';
    plataforma.textContent = juego.plataforma;

    meta.append(categoria, plataforma);

    const descripcion = document.createElement('p');
    descripcion.className = 'card-text descripcion-tarjeta';
    descripcion.textContent = juego.descripcion;

    const pie = document.createElement('div');
    pie.className = 'pie-tarjeta';

    const precio = document.createElement('p');
    precio.className = 'precio mb-0';
    precio.textContent = pesos.format(juego.precio);

    const clasificacion = document.createElement('span');
    clasificacion.className = 'clasificacion';
    clasificacion.textContent = juego.clasificacion;

    pie.append(precio, clasificacion);
    cuerpo.append(titulo, meta, descripcion, pie);
    articulo.append(portada, cuerpo);
    columna.append(articulo);

    return columna;
  }

  function crear(opciones) {
    const rejilla = opciones.rejilla;
    const contenedorFiltros = opciones.filtros;
    const resumen = opciones.resumen;
    const vacio = opciones.vacio;
    const buscador = opciones.buscador;
    const juegos = opciones.juegos;
    const categorias = opciones.categorias;

    let categoriaActiva = TODAS;
    let termino = '';

    function visibles() {
      return juegos.filter(function (juego) {
        const coincideCategoria = categoriaActiva === TODAS || juego.categoria === categoriaActiva;
        if (!coincideCategoria) {
          return false;
        }
        if (termino === '') {
          return true;
        }
        const texto = normalizar(juego.nombre + ' ' + juego.plataforma + ' ' + juego.categoria);
        return texto.includes(termino);
      });
    }

    function describir(cantidad) {
      const parte = cantidad === 1 ? '1 videojuego' : cantidad + ' videojuegos';
      const alcance = categoriaActiva === TODAS
        ? 'del catálogo completo'
        : 'de la categoría ' + categoriaActiva;
      const busqueda = termino === '' ? '' : ' que coinciden con la búsqueda';
      return 'Mostrando ' + parte + ' ' + alcance + busqueda + '.';
    }

    function pintar() {
      const lista = visibles();

      /* Se reemplaza el contenido completo de la rejilla en cada repintado:
         con doce tarjetas es más simple y rápido que reconciliar nodo por nodo. */
      rejilla.replaceChildren();

      const fragmento = document.createDocumentFragment();
      lista.forEach(function (juego) {
        fragmento.append(crearTarjeta(juego));
      });
      rejilla.append(fragmento);

      resumen.textContent = describir(lista.length);
      vacio.classList.toggle('d-none', lista.length > 0);

      Array.prototype.forEach.call(
        contenedorFiltros.querySelectorAll('.filtro-categoria'),
        function (boton) {
          boton.setAttribute('aria-pressed', boton.dataset.categoria === categoriaActiva ? 'true' : 'false');
        }
      );
    }

    function montarFiltros() {
      const fragmento = document.createDocumentFragment();
      fragmento.append(crearBotonCategoria('Todas', TODAS, true));
      categorias.forEach(function (nombre) {
        fragmento.append(crearBotonCategoria(nombre, nombre, false));
      });
      contenedorFiltros.replaceChildren(fragmento);

      /* Un solo escucha en el contenedor cubre todos los botones (delegación). */
      contenedorFiltros.addEventListener('click', function (evento) {
        const boton = evento.target.closest('.filtro-categoria');
        if (!boton) {
          return;
        }
        categoriaActiva = boton.dataset.categoria;
        pintar();
      });
    }

    function montarBuscador() {
      if (!buscador) {
        return;
      }
      buscador.addEventListener('input', function () {
        termino = normalizar(buscador.value.trim());
        pintar();
      });
    }

    function limpiar() {
      categoriaActiva = TODAS;
      termino = '';
      if (buscador) {
        buscador.value = '';
      }
      pintar();
    }

    function iniciar() {
      montarFiltros();
      montarBuscador();
      pintar();
    }

    return { iniciar: iniciar, limpiar: limpiar };
  }

  global.PixelPlay = global.PixelPlay || {};
  global.PixelPlay.catalogo = { crear: crear, normalizar: normalizar, formatearPrecio: pesos.format.bind(pesos) };
})(window);
