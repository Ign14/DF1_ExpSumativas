import { useCallback, useMemo, useState } from 'react';
import BarraNavegacion from './components/BarraNavegacion.jsx';
import Filtros from './components/Filtros.jsx';
import ListaVideojuegos from './components/ListaVideojuegos.jsx';
import FormularioVideojuego from './components/FormularioVideojuego.jsx';
import FormularioContacto from './components/FormularioContacto.jsx';
import ResumenCatalogo from './components/ResumenCatalogo.jsx';
import useVideojuegos from './hooks/useVideojuegos.jsx';
import { normalizar } from './utilidades/formato.js';

export default function App() {
  const { videojuegos, categorias, cargando, error, agregar, eliminar, reintentar } = useVideojuegos();

  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [mensajesRecibidos, setMensajesRecibidos] = useState(0);

  /* La lista filtrada se recalcula solo cuando cambian la lista o los filtros,
     no en cada render de los formularios. */
  const visibles = useMemo(() => {
    const termino = normalizar(busqueda.trim());

    return videojuegos.filter((juego) => {
      if (categoriaActiva !== 'todas' && juego.categoria !== categoriaActiva) {
        return false;
      }
      if (termino === '') {
        return true;
      }
      return normalizar(juego.nombre + ' ' + juego.plataforma + ' ' + juego.categoria).includes(termino);
    });
  }, [videojuegos, categoriaActiva, busqueda]);

  const totales = useMemo(() => {
    if (visibles.length === 0) {
      return { promedio: 0, masBarato: null };
    }

    const suma = visibles.reduce((acumulado, juego) => acumulado + juego.precio, 0);
    const masBarato = visibles.reduce(
      (menor, juego) => (juego.precio < menor.precio ? juego : menor),
      visibles[0]
    );

    return { promedio: Math.round(suma / visibles.length), masBarato };
  }, [visibles]);

  const limpiarFiltros = useCallback(() => {
    setCategoriaActiva('todas');
    setBusqueda('');
  }, []);

  const registrarMensaje = useCallback(() => {
    setMensajesRecibidos((cantidad) => cantidad + 1);
  }, []);

  return (
    <>
      <BarraNavegacion
        visibles={visibles.length}
        total={videojuegos.length}
        onVerTodo={limpiarFiltros}
      />

      <main className="container py-4">
        <header className="encabezado-panel">
          <h1 className="h3 mb-2">Catálogo administrable en React</h1>
          <p className="mb-0">
            La misma tienda resuelta con componentes funcionales. El catálogo se carga con la
            Fetch API desde <code>videojuegos.json</code> y queda en el estado del componente, así
            que los videojuegos que agregues o elimines se reflejan de inmediato en la lista, en el
            contador de la barra y en el resumen.
          </p>
        </header>

        <ResumenCatalogo
          visibles={visibles.length}
          total={videojuegos.length}
          promedio={totales.promedio}
          masBarato={totales.masBarato}
        />

        <Filtros
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          busqueda={busqueda}
          onCambiarCategoria={setCategoriaActiva}
          onBuscar={setBusqueda}
        />

        <section aria-labelledby="titulo-lista" className="mb-5">
          <h2 className="h5 mb-3" id="titulo-lista">Videojuegos en lista</h2>
          <ListaVideojuegos
            juegos={visibles}
            cargando={cargando}
            error={error}
            onEliminar={eliminar}
            onReintentar={reintentar}
            onLimpiar={limpiarFiltros}
          />
        </section>

        <section className="row g-4" aria-labelledby="titulo-formularios">
          <h2 className="h5 visually-hidden" id="titulo-formularios">Formularios</h2>

          <div className="col-lg-6">
            <FormularioVideojuego categorias={categorias} onAgregar={agregar} />
          </div>

          <div className="col-lg-6">
            <FormularioContacto onEnviado={registrarMensaje} />
            {mensajesRecibidos > 0 && (
              <p className="contador-mensajes" role="status" aria-live="polite">
                Mensajes enviados en esta sesión: {mensajesRecibidos}
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="pie">
        <div className="container text-center">
          <p className="mb-1">
            PixelPlay Store · Versión React · Evaluación Final Transversal de Desarrollo Frontend I
            (PFY2201)
          </p>
          <p className="mb-0">Ignacio Miño Astorga · Duoc UC</p>
        </div>
      </footer>
    </>
  );
}
