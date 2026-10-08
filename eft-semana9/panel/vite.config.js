import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* El codigo fuente vive en app/ y Vite compila a app/dist. `npm run build`
   ejecuta despues scripts/publicar.js, que copia ese resultado a la raiz de
   panel/, que es la ruta que sirve GitHub Pages. `base` apunta a esa subruta
   para que los assets resuelvan al publicar. */
export default defineConfig({
  plugins: [react()],
  root: 'app',
  base: '/DF1_ExpSumativas/eft-semana9/panel/',
  build: { outDir: 'dist', emptyOutDir: true, assetsDir: 'assets' }
});
