/* Objeto con la información de la tienda. Es la única fuente de datos del sitio:
   el catálogo del index se arma desde aquí y panel/scripts/sincronizar-datos.js
   genera a partir de este mismo archivo el JSON que consume la versión React. */
(function (global) {
  'use strict';

  const tienda = {
    nombre: 'PixelPlay Store',
    moneda: 'CLP',
    actualizado: '2026-10-08',
    categorias: ['Acción', 'Aventura', 'Carreras', 'Deportes', 'Estrategia', 'RPG'],
    videojuegos: [
      {
        id: 1,
        nombre: 'Neón Vórtice',
        categoria: 'Acción',
        plataforma: 'PC',
        clasificacion: '+16',
        precio: 29990,
        descripcion: 'Combate rápido en arenas verticales con progresión por rondas y modo contrarreloj.',
        imagen: 'img/juego-01.svg'
      },
      {
        id: 2,
        nombre: 'Protocolo Centinela',
        categoria: 'Acción',
        plataforma: 'PlayStation 5',
        clasificacion: '+18',
        precio: 44990,
        descripcion: 'Shooter táctico cooperativo para cuatro jugadores con mapas generados por misión.',
        imagen: 'img/juego-02.svg'
      },
      {
        id: 3,
        nombre: 'Garra de Hierro',
        categoria: 'Acción',
        plataforma: 'Xbox Series X',
        clasificacion: '+16',
        precio: 34990,
        descripcion: 'Peleas uno contra uno con veinte luchadores, entrenamiento guiado y modo torneo.',
        imagen: 'img/juego-03.svg'
      },
      {
        id: 4,
        nombre: 'Última Órbita',
        categoria: 'Aventura',
        plataforma: 'Xbox Series X',
        clasificacion: '+12',
        precio: 32990,
        descripcion: 'Aventura espacial narrativa con gestión de recursos y exploración de sistemas estelares.',
        imagen: 'img/juego-04.svg'
      },
      {
        id: 5,
        nombre: 'Islas de Vael',
        categoria: 'Aventura',
        plataforma: 'Nintendo Switch',
        clasificacion: 'TP',
        precio: 27990,
        descripcion: 'Exploración tranquila de un archipiélago, con pesca, cultivo y mapas que se dibujan solos.',
        imagen: 'img/juego-05.svg'
      },
      {
        id: 6,
        nombre: 'Reinos de Aether',
        categoria: 'RPG',
        plataforma: 'PC',
        clasificacion: '+16',
        precio: 46990,
        descripcion: 'RPG de mundo abierto con más de 80 horas de campaña y decisiones que cambian el final.',
        imagen: 'img/juego-06.svg'
      },
      {
        id: 7,
        nombre: 'Crónicas de Dunhall',
        categoria: 'RPG',
        plataforma: 'PlayStation 5',
        clasificacion: '+12',
        precio: 39990,
        descripcion: 'Rol por turnos con party de seis personajes y un árbol de habilidades por clase.',
        imagen: 'img/juego-07.svg'
      },
      {
        id: 8,
        nombre: 'Neon Drift Racer',
        categoria: 'Carreras',
        plataforma: 'PlayStation 5',
        clasificacion: '+7',
        precio: 39990,
        descripcion: 'Carreras arcade en circuitos futuristas con modo cooperativo para cuatro jugadores.',
        imagen: 'img/juego-08.svg'
      },
      {
        id: 9,
        nombre: 'Asfalto Cero',
        categoria: 'Carreras',
        plataforma: 'PC',
        clasificacion: '+7',
        precio: 24990,
        descripcion: 'Conducción urbana nocturna con treinta autos licenciados y taller de personalización.',
        imagen: 'img/juego-09.svg'
      },
      {
        id: 10,
        nombre: 'Liga Pixel 26',
        categoria: 'Deportes',
        plataforma: 'Nintendo Switch',
        clasificacion: 'TP',
        precio: 42990,
        descripcion: 'Fútbol de temporada con ligas chilenas, modo carrera y partidas locales a cuatro mandos.',
        imagen: 'img/juego-10.svg'
      },
      {
        id: 11,
        nombre: 'Imperios de Arena',
        categoria: 'Estrategia',
        plataforma: 'PC',
        clasificacion: '+12',
        precio: 35990,
        descripcion: 'Estrategia en tiempo real ambientada en ciudades del desierto, con cuatro facciones jugables.',
        imagen: 'img/juego-11.svg'
      },
      {
        id: 12,
        nombre: 'Bloque Cero',
        categoria: 'Estrategia',
        plataforma: 'Nintendo Switch',
        clasificacion: 'TP',
        precio: 19990,
        descripcion: 'Puzles de lógica por niveles con editor incluido para crear y compartir tus desafíos.',
        imagen: 'img/juego-12.svg'
      }
    ]
  };

  global.PixelPlay = global.PixelPlay || {};
  global.PixelPlay.datos = tienda;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = tienda;
  }
})(typeof window !== 'undefined' ? window : globalThis);
