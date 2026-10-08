import { useState } from 'react';

const VACIO = { nombre: '', email: '', mensaje: '' };
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function validar(campos) {
  const errores = {};

  if (campos.nombre.trim().length < 3) {
    errores.nombre = 'Escribe tu nombre (al menos 3 caracteres).';
  }
  if (!PATRON_EMAIL.test(campos.email.trim())) {
    errores.email = 'El correo no tiene un formato válido (ejemplo: nombre@dominio.cl).';
  }

  const mensaje = campos.mensaje.trim();
  if (mensaje.length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  } else if (mensaje.length > 500) {
    errores.mensaje = 'El mensaje no puede superar los 500 caracteres.';
  }

  return errores;
}

/* Formulario de contacto con la misma validación que la versión en JavaScript
   plano, resuelta aquí con estado local en lugar de clases en el DOM. */
export default function FormularioContacto({ onEnviado }) {
  const [campos, setCampos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(null);

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
      setEnviado(null);
      return;
    }

    const copia = { ...campos, nombre: campos.nombre.trim(), email: campos.email.trim() };
    setEnviado(copia);
    setCampos(VACIO);

    if (typeof onEnviado === 'function') {
      onEnviado(copia);
    }
  }

  return (
    <form className="tarjeta-formulario" onSubmit={enviar} noValidate>
      <h2 className="h5 mb-3">Formulario de contacto</h2>

      <div className="mb-3">
        <label className="form-label" htmlFor="contactoNombre">Nombre</label>
        <input
          className={'form-control' + (errores.nombre ? ' campo-invalido' : '')}
          type="text"
          id="contactoNombre"
          autoComplete="name"
          value={campos.nombre}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby="errorContactoNombre"
          onChange={(evento) => actualizar('nombre', evento.target.value)}
        />
        <p className="mensaje-error" id="errorContactoNombre">{errores.nombre || ''}</p>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="contactoEmail">Correo electrónico</label>
        <input
          className={'form-control' + (errores.email ? ' campo-invalido' : '')}
          type="email"
          id="contactoEmail"
          autoComplete="email"
          value={campos.email}
          aria-invalid={Boolean(errores.email)}
          aria-describedby="errorContactoEmail"
          onChange={(evento) => actualizar('email', evento.target.value)}
        />
        <p className="mensaje-error" id="errorContactoEmail">{errores.email || ''}</p>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="contactoMensaje">Mensaje</label>
        <textarea
          className={'form-control' + (errores.mensaje ? ' campo-invalido' : '')}
          id="contactoMensaje"
          rows="4"
          value={campos.mensaje}
          aria-invalid={Boolean(errores.mensaje)}
          aria-describedby="errorContactoMensaje ayudaContactoMensaje"
          onChange={(evento) => actualizar('mensaje', evento.target.value)}
        ></textarea>
        <p className="form-text" id="ayudaContactoMensaje">
          {campos.mensaje.trim().length} de 500 caracteres.
        </p>
        <p className="mensaje-error" id="errorContactoMensaje">{errores.mensaje || ''}</p>
      </div>

      <button className="btn btn-pixel w-100" type="submit">Enviar mensaje</button>

      {enviado !== null && (
        <div className="alert alert-success mt-3 mb-0" role="status" aria-live="polite">
          Gracias, {enviado.nombre}. Responderemos a {enviado.email}.
        </div>
      )}
    </form>
  );
}
