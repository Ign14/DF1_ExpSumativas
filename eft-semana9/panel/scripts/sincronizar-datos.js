/* Genera app/public/videojuegos.json y copia las portadas a app/public/img
   a partir de ../js/datos.js, para que la version React y la version en
   JavaScript plano no puedan desincronizarse. */
import { createRequire } from 'node:module';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const aqui = dirname(fileURLToPath(import.meta.url));
const raizSitio = resolve(aqui, '..', '..');

const tienda = require(resolve(raizSitio, 'js', 'datos.js'));

const destinoDatos = resolve(aqui, '..', 'app', 'public', 'videojuegos.json');
const destinoImagenes = resolve(aqui, '..', 'app', 'public', 'img');

mkdirSync(dirname(destinoDatos), { recursive: true });
writeFileSync(destinoDatos, JSON.stringify(tienda, null, 2) + '\n', 'utf8');

mkdirSync(destinoImagenes, { recursive: true });
cpSync(resolve(raizSitio, 'img'), destinoImagenes, { recursive: true });

console.log(`videojuegos.json: ${tienda.videojuegos.length} titulos`);
