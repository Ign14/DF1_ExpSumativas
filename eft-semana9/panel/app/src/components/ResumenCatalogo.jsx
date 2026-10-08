import { formatearPrecio } from '../utilidades/formato.js';

/* Muestra los totales que App calcula con useMemo. */
export default function ResumenCatalogo({ visibles, total, promedio, masBarato }) {
  return (
    <dl className="resumen-catalogo">
      <div>
        <dt>En pantalla</dt>
        <dd>{visibles} de {total}</dd>
      </div>
      <div>
        <dt>Precio promedio</dt>
        <dd>{visibles === 0 ? '—' : formatearPrecio(promedio)}</dd>
      </div>
      <div>
        <dt>Más económico</dt>
        <dd>{masBarato === null ? '—' : masBarato.nombre}</dd>
      </div>
    </dl>
  );
}
