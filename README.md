# Desarrollo Frontend I (PFY2201) — Experiencias sumativas

Ignacio Miño Astorga · Duoc UC

Actividades sumativas del curso. Cada experiencia es un proyecto independiente con su propio
código, documentación y capturas. Ambas comparten el mismo caso: **PixelPlay Store**, una
tienda de videojuegos y accesorios. La segunda retoma la tienda de la primera y la reconstruye
con Bootstrap 5, agregándole interactividad con JavaScript; la tercera la vuelve a construir en
React con componentes funcionales y Hooks.

Portada publicada: https://ign14.github.io/DF1_ExpSumativas/

| | Experiencia | Contenido | Sitio |
|---|---|---|---|
| **1** | Semana 3 | HTML5 semántico, modelo de cajas, Flexbox, CSS Grid y media queries | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp1-semana3/) |
| **2** | Semana 6 | Bootstrap 5, manipulación del DOM, eventos, Fetch API y manejo de errores | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp2-semana6/) |
| **3** | Semanas 7 y 8 | React con componentes funcionales, useState, useEffect y renderizado condicional | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp3-semana8/) |

## Estructura

```
DF1_ExpSumativas/
├── index.html              Portada con acceso a ambas experiencias
├── exp1-semana3/           HTML y CSS
├── exp2-semana6/           Bootstrap 5 y JavaScript
└── exp3-semana8/           React + Vite (código en app/, build en la raíz)
```

## Ejecutar en local

La Experiencia 1 se abre directamente en el navegador. Las Experiencias 2 y 3 cargan datos de
forma asíncrona, así que necesitan servirse por HTTP:

```bash
git clone https://github.com/Ign14/DF1_ExpSumativas.git
cd DF1_ExpSumativas
python -m http.server 8000
```

Para trabajar sobre la Experiencia 3 con recarga en caliente:

```bash
cd exp3-semana8
npm install
npm run dev
```

## Publicación

El sitio se despliega desde la rama `gh-pages`. Cada experiencia queda en su propia subruta
bajo `https://ign14.github.io/DF1_ExpSumativas/`.
