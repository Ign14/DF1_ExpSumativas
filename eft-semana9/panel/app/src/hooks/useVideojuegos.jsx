import { useCallback, useEffect, useRef, useState } from 'react';

const RUTA_DATOS = import.meta.env.BASE_URL + 'videojuegos.json';
const TIEMPO_LIMITE = 8000;

/* Traduce el error técnico a un texto que el usuario pueda entender. */
function describirError(error) {
  if (error.name === 'AbortError') {
    return 'La carga tardó demasiado. Revisa tu conexión y vuelve a intentarlo.';
  }
  if (error instanceof SyntaxError) {
    return 'El archivo de datos llegó dañado y no se pudo leer.';
  }
  if (error.message.startsWith('HTTP ')) {
    return 'El servidor respondió con un error (' + error.message + ').';
  }
  if (window.location.protocol === 'file:') {
    return 'Abre el proyecto con un servidor local: al abrir el archivo directamente el navegador bloquea la carga de datos.';
  }
  if (error.message === 'CATALOGO_VACIO') {
    return 'El catálogo llegó vacío. Revisa el archivo videojuegos.json.';
  }
  return 'No se pudo cargar el catálogo. Inténtalo de nuevo en unos segundos.';
}

/* Carga el catálogo con la Fetch API y guarda la lista en el estado del
   componente. Devuelve además las acciones de alta y baja, para que la lista
   que se muestra sea siempre el estado de React y no el archivo original. */
export default function useVideojuegos() {
  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intento, setIntento] = useState(0);

  /* Los identificadores nuevos continúan sobre el mayor id recibido. */
  const siguienteId = useRef(1);

  useEffect(() => {
    let vigente = true;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE);

    async function cargar() {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(RUTA_DATOS, { signal: controlador.signal });

        /* Una respuesta 404 no rechaza la promesa: hay que revisar `ok`. */
        if (!respuesta.ok) {
          throw new Error('HTTP ' + respuesta.status);
        }

        const datos = await respuesta.json();
        const lista = Array.isArray(datos.videojuegos) ? datos.videojuegos : [];

        if (lista.length === 0) {
          throw new Error('CATALOGO_VACIO');
        }

        if (!vigente) {
          return;
        }

        siguienteId.current = Math.max(...lista.map((juego) => juego.id)) + 1;
        setVideojuegos(lista);
        setCategorias(Array.isArray(datos.categorias) ? datos.categorias : []);
      } catch (fallo) {
        if (vigente) {
          setError(describirError(fallo));
        }
      } finally {
        clearTimeout(temporizador);
        if (vigente) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      vigente = false;
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [intento]);

  const agregar = useCallback((datos) => {
    const nuevo = { ...datos, id: siguienteId.current };
    siguienteId.current += 1;
    setVideojuegos((lista) => [nuevo, ...lista]);
    return nuevo;
  }, []);

  const eliminar = useCallback((id) => {
    setVideojuegos((lista) => lista.filter((juego) => juego.id !== id));
  }, []);

  const reintentar = useCallback(() => {
    setIntento((numero) => numero + 1);
  }, []);

  return { videojuegos, categorias, cargando, error, agregar, eliminar, reintentar };
}
