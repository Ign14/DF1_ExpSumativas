import { useState, useMemo, useRef } from 'react';
import Encabezado from './components/Encabezado.jsx';
import Filtros from './components/Filtros.jsx';
import Catalogo from './components/Catalogo.jsx';
import Carrito from './components/Carrito.jsx';
import { normalizar } from './data/formato.js';
import { useProductos } from './hooks/useProductos.jsx';
import { useCarrito } from './hooks/useCarrito.jsx';

export default function App() {
  // Los dos hooks propios concentran la lógica: App solo compone la vista
  const { productos, cargando, error, reintentar } = useProductos();
  const carrito = useCarrito();

  // Estado de los filtros. Vive aquí porque lo comparten Filtros y Catalogo
  const [categoria, setCategoria] = useState('todos');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const refCarrito = useRef(null);

  // Se recalcula solo cuando cambian los productos o los filtros
  /* Lista filtrada. Se memoriza para no recalcularla en cada render del
     carrito, que cambia mucho más seguido que los filtros. */
  const visibles = useMemo(() => {
    const termino = normalizar(busqueda);

    return productos.filter((p) => {
      const coincideCategoria = categoria === 'todos' || p.categoria === categoria;
      const esOferta = p.precioAnterior > p.precio;
      const texto = normalizar(`${p.nombre} ${p.plataforma} ${p.genero} ${p.descripcion}`);
      const coincideBusqueda = !termino || texto.includes(termino);

      return coincideCategoria && (!soloOfertas || esOferta) && coincideBusqueda;
    });
  }, [productos, categoria, soloOfertas, busqueda]);

  // Cuántas unidades de un producto hay en el carrito; 0 si no está
  const cantidadDe = (id) => carrito.lineas.find((l) => l.producto.id === id)?.cantidad ?? 0;

  function limpiarFiltros() {
    setCategoria('todos');
    setSoloOfertas(false);
    setBusqueda('');
  }

  function irAlCarrito() {
    refCarrito.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Encabezado unidades={carrito.totales.unidades} onIrAlCarrito={irAlCarrito} />

      <main className="contenedor">
        <section className="portada">
          <h1>PixelPlay Store</h1>
          <p>
            Videojuegos y accesorios con precios de oferta. El catálogo se carga de forma
            asíncrona y el carrito se actualiza al instante.
          </p>
        </section>

        <section id="catalogo" className="seccion">
          <div className="seccion__cabecera">
            <h2>Catálogo de productos</h2>
            {/* El resumen solo tiene sentido cuando ya hay datos */}
            {!cargando && !error && (
              <p className="seccion__resumen">
                {visibles.length === 0
                  ? 'Sin productos para los filtros aplicados.'
                  : `Mostrando ${visibles.length} ${visibles.length === 1 ? 'producto' : 'productos'}.`}
              </p>
            )}
          </div>

          <Filtros
            categoria={categoria}
            onCategoria={setCategoria}
            soloOfertas={soloOfertas}
            onSoloOfertas={setSoloOfertas}
            busqueda={busqueda}
            onBuscar={setBusqueda}
          />

          <Catalogo
            productos={visibles}
            cargando={cargando}
            error={error}
            onReintentar={reintentar}
            estaEnCarrito={carrito.estaEnCarrito}
            cantidadDe={cantidadDe}
            onAgregar={carrito.agregar}
            onLimpiarFiltros={limpiarFiltros}
          />
        </section>

        <div ref={refCarrito}>
          <Carrito
            lineas={carrito.lineas}
            totales={carrito.totales}
            onSumar={carrito.agregar}
            onQuitar={carrito.quitar}
            onEliminar={carrito.eliminar}
            onVaciar={carrito.vaciar}
            envioGratisDesde={carrito.ENVIO_GRATIS_DESDE}
          />
        </div>
      </main>

      <footer className="pie">
        <div className="contenedor">
          <p>PixelPlay Store · Av. Providencia 1234, Santiago · contacto@pixelplay.cl</p>
          <p className="pie__legal">
            Experiencia 3 — Desarrollo Frontend I (PFY2201) · Ignacio Miño Astorga
          </p>
        </div>
      </footer>
    </>
  );
}
