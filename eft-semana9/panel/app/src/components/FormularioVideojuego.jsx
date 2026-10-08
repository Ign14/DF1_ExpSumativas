import { useState } from 'react';

const VACIO = {
  nombre: '',
  categoria: '',
  plataforma: 'PC',
  clasificacion: 'TP',
  precio: '',
  descripcion: ''
};

const PLATAFORMAS = ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch'];
const CLASIFICACIONES = ['TP', '+7', '+12', '+16', '+18'];
const PORTADAS = 12;

function validar(campos) {
  const errores = {};

  if (campos.nombre.trim().length < 3) {
    errores.nombre = 'Escribe un nombre de al menos 3 caracteres.';
  }
  if (campos.categoria === '') {
    errores.categoria = 'Selecciona una categoría.';
  }

  const precio = Number(campos.precio);
  if (campos.precio === '' || Number.isNaN(precio) || precio <= 0) {
    errores.precio = 'Indica un precio mayor que cero.';
  }
  if (campos.descripcion.trim().length < 15) {
    errores.descripcion = 'La descripción debe tener al menos 15 caracteres.';
  }

  return errores;
}

/* Alta de videojuegos. Mantiene en estado local lo que se está escribiendo y
   entrega el registro validado al componente App mediante onAgregar. */
export default function FormularioVideojuego({ categorias, onAgregar }) {
  const [campos, setCampos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [confirmacion, setConfirmacion] = useState('');

  function actualizar(nombre, valor) {
    setCampos((anterior) => ({ ...anterior, [nombre]: valor }));
    if (errores[nombre]) {
      setErrores((anterior) => ({ ...anterior, [nombre]: undefined }));
    }
  }

  function enviar(evento) {
    evento.preventDefault();

    const encontrados = validar(campos);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      setConfirmacion('');
      return;
    }

    /* Se reutiliza una de las portadas del catálogo para que la tarjeta nueva
       se vea igual que las demás sin pedir una imagen al usuario. */
    const numero = String(Math.floor(Math.random() * PORTADAS) + 1).padStart(2, '0');

    const agregado = onAgregar({
      nombre: campos.nombre.trim(),
      categoria: campos.categoria,
      plataforma: campos.plataforma,
      clasificacion: campos.clasificacion,
      precio: Number(campos.precio),
      descripcion: campos.descripcion.trim(),
      imagen: 'img/juego-' + numero + '.svg'
    });

    setCampos(VACIO);
    setConfirmacion('"' + agregado.nombre + '" se agregó al inicio de la lista.');
  }

  return (
    <form className="tarjeta-formulario" onSubmit={enviar} noValidate>
      <h2 className="h5 mb-3">Agregar un videojuego</h2>

      <div className="mb-3">
        <label className="form-label" htmlFor="nuevoNombre">Nombre</label>
        <input
          className={'form-control' + (errores.nombre ? ' campo-invalido' : '')}
          type="text"
          id="nuevoNombre"
          value={campos.nombre}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby="errorNuevoNombre"
          onChange={(evento) => actualizar('nombre', evento.target.value)}
        />
        <p className="mensaje-error" id="errorNuevoNombre">{errores.nombre || ''}</p>
      </div>

      <div className="row g-3">
        <div className="col-sm-6 mb-1">
          <label className="form-label" htmlFor="nuevaCategoria">Categoría</label>
          <select
            className={'form-select' + (errores.categoria ? ' campo-invalido' : '')}
            id="nuevaCategoria"
            value={campos.categoria}
            aria-invalid={Boolean(errores.categoria)}
            aria-describedby="errorNuevaCategoria"
            onChange={(evento) => actualizar('categoria', evento.target.value)}
          >
            <option value="">Selecciona…</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
          <p className="mensaje-error" id="errorNuevaCategoria">{errores.categoria || ''}</p>
        </div>

        <div className="col-sm-6 mb-1">
          <label className="form-label" htmlFor="nuevaPlataforma">Plataforma</label>
          <select
            className="form-select"
            id="nuevaPlataforma"
            value={campos.plataforma}
            onChange={(evento) => actualizar('plataforma', evento.target.value)}
          >
            {PLATAFORMAS.map((plataforma) => (
              <option key={plataforma} value={plataforma}>{plataforma}</option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 mb-1">
          <label className="form-label" htmlFor="nuevoPrecio">Precio (CLP)</label>
          <input
            className={'form-control' + (errores.precio ? ' campo-invalido' : '')}
            type="number"
            id="nuevoPrecio"
            min="1"
            step="10"
            value={campos.precio}
            aria-invalid={Boolean(errores.precio)}
            aria-describedby="errorNuevoPrecio"
            onChange={(evento) => actualizar('precio', evento.target.value)}
          />
          <p className="mensaje-error" id="errorNuevoPrecio">{errores.precio || ''}</p>
        </div>

        <div className="col-sm-6 mb-1">
          <label className="form-label" htmlFor="nuevaClasificacion">Clasificación</label>
          <select
            className="form-select"
            id="nuevaClasificacion"
            value={campos.clasificacion}
            onChange={(evento) => actualizar('clasificacion', evento.target.value)}
          >
            {CLASIFICACIONES.map((valor) => (
              <option key={valor} value={valor}>{valor}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="nuevaDescripcion">Descripción</label>
        <textarea
          className={'form-control' + (errores.descripcion ? ' campo-invalido' : '')}
          id="nuevaDescripcion"
          rows="3"
          value={campos.descripcion}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby="errorNuevaDescripcion"
          onChange={(evento) => actualizar('descripcion', evento.target.value)}
        ></textarea>
        <p className="mensaje-error" id="errorNuevaDescripcion">{errores.descripcion || ''}</p>
      </div>

      <button className="btn btn-pixel w-100" type="submit">Agregar a la lista</button>

      {confirmacion !== '' && (
        <div className="alert alert-success mt-3 mb-0" role="status" aria-live="polite">
          {confirmacion}
        </div>
      )}
    </form>
  );
}
