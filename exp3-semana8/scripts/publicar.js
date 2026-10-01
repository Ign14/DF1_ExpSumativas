/* Copia el resultado de `vite build` (app/dist) a la raíz de exp3-semana8/,
   que es lo que GitHub Pages publica. Se mantiene fuera de Vite para no
   compilar nunca sobre la carpeta que contiene el código fuente. */
import { cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));
const origen = join(raiz, 'app', 'dist');

if (!existsSync(origen)) {
  console.error('No existe app/dist. Ejecuta primero vite build.');
  process.exit(1);
}

// Se limpia solo lo que genera el build; app/, scripts/ y la documentación quedan intactos
await rm(join(raiz, 'assets'), { recursive: true, force: true });

for (const entrada of await readdir(origen)) {
  await cp(join(origen, entrada), join(raiz, entrada), { recursive: true, force: true });
}

console.log('Build publicado en exp3-semana8/');
