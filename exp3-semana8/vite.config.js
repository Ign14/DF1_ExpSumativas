import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* El código fuente vive en app/ y Vite compila a app/dist.
   `npm run build` ejecuta además scripts/publicar.js, que copia ese resultado
   a la raíz de exp3-semana8/, que es la ruta que sirve GitHub Pages.
   `base` apunta a esa subruta para que los assets resuelvan al publicar. */
export default defineConfig({
  plugins: [react()],
  root: 'app',
  base: '/DF1_ExpSumativas/exp3-semana8/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  }
});
