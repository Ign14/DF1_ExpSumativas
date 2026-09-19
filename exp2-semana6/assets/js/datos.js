/* datos.js - Carga del catálogo con la Fetch API y clasificación de errores. */

window.PP = window.PP || {};

PP.datos = (function () {
  'use strict';

  const RUTA_JSON = 'assets/data/productos.json';
  const TIEMPO_LIMITE_MS = 8000;

  // Catálogo mínimo de respaldo. Solo se usa si el usuario lo pide de forma
  // explícita tras un error, por ejemplo al abrir el archivo con doble clic
  // (protocolo file://), donde el navegador bloquea fetch por seguridad.
  const PRODUCTOS_RESPALDO = [
    {
      id: 1, nombre: 'Neon Drift Racer', categoria: 'juegos', plataforma: 'PlayStation 5',
      genero: 'Carreras', clasificacion: '+7', precio: 39990, precioAnterior: 49990,
      stock: 12, destacado: true,
      descripcion: 'Carreras arcade en circuitos futuristas con modo cooperativo para cuatro jugadores.',
      imagen: 'assets/img/juego-1.svg'
    },
    {
      id: 2, nombre: 'Reinos de Aether', categoria: 'juegos', plataforma: 'PC',
      genero: 'RPG', clasificacion: '+16', precio: 44990, precioAnterior: null,
      stock: 8, destacado: true,
      descripcion: 'RPG de mundo abierto con más de 80 horas de campaña y decisiones que cambian el final.',
      imagen: 'assets/img/juego-2.svg'
    },
    {
      id: 7, nombre: 'Control Inalámbrico Pulse', categoria: 'accesorios', plataforma: 'PlayStation 5',
      genero: 'Mando', clasificacion: 'TP', precio: 59990, precioAnterior: 69990,
      stock: 10, destacado: true,
      descripcion: 'Mando inalámbrico con gatillos adaptativos, respuesta háptica y 12 horas de batería.',
      imagen: 'assets/img/accesorio-1.svg'
    }
  ];

  /** Un JSON bien formado pero incompleto también es un error de datos. */
  function validarProductos(lista) {
    if (!Array.isArray(lista) || lista.length === 0) {
      throw new Error('DATOS_VACIOS');
    }

    const camposObligatorios = ['id', 'nombre', 'precio', 'categoria', 'imagen'];

    const validos = lista.filter(function (producto) {
      return producto && camposObligatorios.every(function (campo) {
        return producto[campo] !== undefined && producto[campo] !== null;
      });
    });

    if (validos.length === 0) {
      throw new Error('DATOS_INVALIDOS');
    }

    return validos;
  }

  /** Traduce cada fallo a un mensaje para el usuario. El caso file:// va
      primero porque es el más frecuente al abrir el proyecto sin servidor. */
  function describirError(error) {
    const esFile = window.location.protocol === 'file:';

    if (esFile) {
      return {
        titulo: 'El navegador bloqueó la carga del catálogo',
        detalle: 'Estás viendo la página con el protocolo <code>file://</code> y, por seguridad, ' +
                 'el navegador no permite que la Fetch API lea archivos locales. Publica el sitio ' +
                 'o levanta un servidor con <code>python -m http.server 8000</code> y entra a ' +
                 '<code>http://localhost:8000</code>.'
      };
    }

    if (error && error.message === 'DATOS_VACIOS') {
      return {
        titulo: 'El catálogo llegó vacío',
        detalle: 'El archivo de productos se descargó, pero no contiene ningún registro.'
      };
    }

    if (error && error.message === 'DATOS_INVALIDOS') {
      return {
        titulo: 'Los datos del catálogo no tienen el formato esperado',
        detalle: 'Los productos recibidos no incluyen los campos mínimos (id, nombre, precio, categoría e imagen).'
      };
    }

    if (error && error.name === 'AbortError') {
      return {
        titulo: 'La carga del catálogo tardó demasiado',
        detalle: 'El servidor no respondió dentro de ' + (TIEMPO_LIMITE_MS / 1000) + ' segundos. Revisa tu conexión e inténtalo otra vez.'
      };
    }

    if (error && typeof error.message === 'string' && error.message.indexOf('HTTP') === 0) {
      return {
        titulo: 'No pudimos cargar el catálogo',
        detalle: 'El servidor respondió con el estado <strong>' + PP.utilidades.escapar(error.message) + '</strong>.'
      };
    }

    return {
      titulo: 'No pudimos cargar el catálogo',
      detalle: 'Ocurrió un problema al conectarse con el servidor. Inténtalo nuevamente en unos segundos.'
    };
  }

  /** Devuelve una promesa con los productos validados, o rechazada con un
      error ya clasificado. */
  function obtenerProductos() {
    // AbortController evita que la promesa quede pendiente para siempre
    // si el servidor nunca responde.
    const controlador = new AbortController();
    const temporizador = setTimeout(function () {
      controlador.abort();
    }, TIEMPO_LIMITE_MS);

    return fetch(RUTA_JSON, { cache: 'no-store', signal: controlador.signal })
      .then(function (respuesta) {
        // fetch solo rechaza ante errores de red: un 404 llega aquí como
        // respuesta válida, por eso se revisa ok de forma explícita.
        if (!respuesta.ok) {
          throw new Error('HTTP ' + respuesta.status + ' ' + respuesta.statusText);
        }
        return respuesta.json();
      })
      .then(function (json) {
        const lista = Array.isArray(json) ? json : json.productos;
        return validarProductos(lista);
      })
      .finally(function () {
        clearTimeout(temporizador);
      });
  }

  return {
    obtenerProductos: obtenerProductos,
    describirError: describirError,
    PRODUCTOS_RESPALDO: PRODUCTOS_RESPALDO,
    RUTA_JSON: RUTA_JSON
  };
})();
