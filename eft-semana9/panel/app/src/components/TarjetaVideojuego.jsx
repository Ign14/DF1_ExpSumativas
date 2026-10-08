import { formatearPrecio } from '../utilidades/formato.js';

/* Tarjeta de un videojuego. Solo recibe datos y avisa hacia arriba cuando se
   pulsa eliminar: el estado vive en App. */
export default function TarjetaVideojuego({ juego, onEliminar }) {
  return (
    <article className="card tarjeta-juego">
      <img className="card-img-top" src={juego.imagen} alt={'Portada de ' + juego.nombre} width="400" height="260" loading="lazy" />

      <div className="card-body cuerpo-tarjeta">
        <h3 className="card-title">{juego.nombre}</h3>

        <div className="meta-tarjeta">
          <span className="badge insignia">{juego.categoria}</span>
          <span className="badge insignia insignia--plataforma">{juego.plataforma}</span>
        </div>

        <p className="card-text descripcion-tarjeta">{juego.descripcion}</p>

        <div className="pie-tarjeta">
          <p className="precio mb-0">{formatearPrecio(juego.precio)}</p>
          <span className="clasificacion">{juego.clasificacion}</span>
        </div>

        <button
          className="btn btn-outline-danger w-100 mt-3 boton-eliminar"
          type="button"
          onClick={() => onEliminar(juego.id)}
        >
          Eliminar del catálogo
        </button>
      </div>
    </article>
  );
}
