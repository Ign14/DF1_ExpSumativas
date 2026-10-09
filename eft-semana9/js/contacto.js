/* Validación del formulario de contacto antes del envío. */
(function (global) {
  'use strict';

  const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const MIN_MENSAJE = 10;
  const MAX_MENSAJE = 500;

  function validarNombre(valor) {
    const limpio = valor.trim();
    if (limpio === '') {
      return 'Escribe tu nombre.';
    }
    if (limpio.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!/^[\p{L}\p{M}\s.'-]+$/u.test(limpio)) {
      return 'El nombre solo admite letras, espacios, guiones y apóstrofos.';
    }
    return '';
  }

  function validarEmail(valor) {
    const limpio = valor.trim();
    if (limpio === '') {
      return 'Escribe tu correo electrónico.';
    }
    if (!PATRON_EMAIL.test(limpio)) {
      return 'El correo no tiene un formato válido (ejemplo: nombre@dominio.cl).';
    }
    return '';
  }

  function validarMensaje(valor) {
    const limpio = valor.trim();
    if (limpio === '') {
      return 'Escribe tu mensaje.';
    }
    if (limpio.length < MIN_MENSAJE) {
      return 'El mensaje debe tener al menos ' + MIN_MENSAJE + ' caracteres.';
    }
    if (limpio.length > MAX_MENSAJE) {
      return 'El mensaje no puede superar los ' + MAX_MENSAJE + ' caracteres.';
    }
    return '';
  }

  function crear(opciones) {
    const formulario = opciones.formulario;
    const aviso = opciones.aviso;

    const campos = [
      { entrada: opciones.nombre, error: opciones.errorNombre, validar: validarNombre },
      { entrada: opciones.email, error: opciones.errorEmail, validar: validarEmail },
      { entrada: opciones.mensaje, error: opciones.errorMensaje, validar: validarMensaje }
    ];

    function mostrarError(campo, texto) {
      campo.error.textContent = texto;
      campo.entrada.classList.toggle('campo-invalido', texto !== '');
      campo.entrada.setAttribute('aria-invalid', texto !== '' ? 'true' : 'false');
    }

    function revisarTodo() {
      let invalidos = 0;
      campos.forEach(function (campo) {
        const texto = campo.validar(campo.entrada.value);
        mostrarError(campo, texto);
        if (texto !== '') {
          invalidos += 1;
        }
      });
      return invalidos;
    }

    function anunciar(texto, clase) {
      aviso.textContent = texto;
      aviso.className = 'alert mt-3 ' + clase;
    }

    /* Al empezar un mensaje nuevo se retira la confirmación del anterior, que
       si no quedaría en pantalla contradiciendo lo que el usuario está haciendo. */
    function retirarConfirmacion() {
      if (aviso.classList.contains('alert-success')) {
        aviso.textContent = '';
        aviso.className = 'alert mt-3 d-none';
      }
    }

    function iniciar() {
      /* Al salir de un campo ya rellenado se avisa el error sin esperar el envío. */
      campos.forEach(function (campo) {
        campo.entrada.addEventListener('blur', function () {
          if (campo.entrada.value.trim() !== '') {
            mostrarError(campo, campo.validar(campo.entrada.value));
          }
        });

        campo.entrada.addEventListener('input', function () {
          retirarConfirmacion();
          if (campo.error.textContent !== '') {
            mostrarError(campo, campo.validar(campo.entrada.value));
          }
        });
      });

      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const invalidos = revisarTodo();

        if (invalidos > 0) {
          anunciar(
            invalidos === 1
              ? 'Hay 1 campo con errores. Revisa el mensaje marcado en rojo.'
              : 'Hay ' + invalidos + ' campos con errores. Revisa los mensajes marcados en rojo.',
            'alert-danger'
          );
          const primerInvalido = campos.find(function (campo) {
            return campo.error.textContent !== '';
          });
          if (primerInvalido) {
            primerInvalido.entrada.focus();
          }
          return;
        }

        /* No hay servidor al que enviar: el proyecto es estático, así que se
           confirma la validación y se limpia el formulario. */
        anunciar(
          'Gracias, ' + opciones.nombre.value.trim() + '. Tu mensaje quedó registrado y te responderemos a ' +
          opciones.email.value.trim() + '.',
          'alert-success'
        );
        formulario.reset();
        campos.forEach(function (campo) {
          mostrarError(campo, '');
        });
      });
    }

    return { iniciar: iniciar };
  }

  global.PixelPlay = global.PixelPlay || {};
  global.PixelPlay.contacto = {
    crear: crear,
    validarNombre: validarNombre,
    validarEmail: validarEmail,
    validarMensaje: validarMensaje
  };
})(window);
