/* Copia app/dist a la raiz de panel/, que es lo que sirve GitHub Pages. */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const origen = resolve(aqui, '..', 'app', 'dist');
const destino = resolve(aqui, '..');

if (!existsSync(origen)) {
  console.error('No existe app/dist. Ejecuta primero vite build.');
  process.exit(1);
}

const assets = resolve(destino, 'assets');
if (existsSync(assets)) {
  rmSync(assets, { recursive: true, force: true });
}

cpSync(origen, destino, { recursive: true });
console.log('Build copiado a panel/');
