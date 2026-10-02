import { useState, useEffect } from 'react';

/* Hook de carga del catálogo.
   Aísla el efecto secundario (la petición al JSON) del resto de la interfaz:
   los componentes solo reciben datos, estado de carga y error. */
/* Traduce el fallo técnico a una frase que el usuario pueda entender.
   El caso file:// va primero: es el más frecuente al abrir el build con
   doble clic, porque el navegador bloquea fetch sobre archivos locales. */
function describirError(e) {
  if (e.name === 'AbortError') {
    return 'El servidor no respondió dentro de 8 segundos. Revisa tu conexión e inténtalo otra vez.';
  }
  if (window.location.protocol === 'file:') {
    return 'El navegador bloquea la lectura de archivos locales. Levanta un servidor con "npm run dev" o abre la versión publicada.';
  }
  if (typeof e.message === 'string' && e.message.startsWith('HTTP')) {
    return `El servidor respondió con el estado ${e.message}.`;
  }
  if (e.message === 'El catálogo llegó vacío.') {
    return 'El archivo de productos se descargó, pero no contiene ningún registro.';
  }
  if (e instanceof SyntaxError) {
    return 'El archivo de productos llegó dañado y no se pudo interpretar.';
  }
  return 'Ocurrió un problema al conectarse con el servidor. Inténtalo nuevamente en unos segundos.';
}

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Evita actualizar el estado si el componente se desmonta a mitad de la carga
    let vigente = true;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), 8000);

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const url = `${import.meta.env.BASE_URL}productos.json`;
        const respuesta = await fetch(url, { signal: controlador.signal });

        // Un 404 llega como respuesta válida: fetch solo rechaza ante fallos de red
        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status} ${respuesta.statusText}`);
        }

        const json = await respuesta.json();
        const lista = Array.isArray(json) ? json : json.productos;

        if (!Array.isArray(lista) || lista.length === 0) {
          throw new Error('El catálogo llegó vacío.');
        }

        if (vigente) setProductos(lista);
      } catch (e) {
        if (vigente) setError(describirError(e));
      } finally {
        clearTimeout(temporizador);
        if (vigente) setCargando(false);
      }
    }

    cargar();

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [intento]);

  // Cambiar `intento` vuelve a disparar el efecto
  const reintentar = () => setIntento((n) => n + 1);

  return { productos, cargando, error, reintentar };
}
