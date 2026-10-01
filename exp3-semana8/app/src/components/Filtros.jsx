const CATEGORIAS = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'juegos', etiqueta: 'Videojuegos' },
  { id: 'accesorios', etiqueta: 'Accesorios' }
];

/* Botones de categoría y el interruptor de solo ofertas.
   El estado vive en App: este componente solo informa los cambios. */
export default function Filtros({ categoria, onCategoria, soloOfertas, onSoloOfertas }) {
  return (
    <div className="filtros">
      <div className="filtros__grupo" role="group" aria-label="Filtrar por categoría">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`boton boton--filtro${categoria === c.id ? ' esta-activo' : ''}`}
            aria-pressed={categoria === c.id}
            onClick={() => onCategoria(c.id)}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      {/* Botón que cambia de texto y de estilo según el estado */}
      <button
        type="button"
        className={`boton boton--interruptor${soloOfertas ? ' esta-activo' : ''}`}
        aria-pressed={soloOfertas}
        onClick={() => onSoloOfertas(!soloOfertas)}
      >
        {soloOfertas ? 'Viendo solo ofertas' : 'Ver solo ofertas'}
      </button>
    </div>
  );
}
