# Desarrollo Frontend I (PFY2201) — Experiencias sumativas y evaluación final

Ignacio Miño Astorga · Duoc UC

Actividades sumativas del curso y la Evaluación Final Transversal. Cada entrega es un proyecto
independiente con su propio código, documentación y capturas. Todas comparten el mismo caso:
**PixelPlay Store**, una tienda de videojuegos y accesorios. La segunda retoma la tienda de la
primera y la reconstruye con Bootstrap 5, agregándole interactividad con JavaScript; la tercera la
vuelve a construir en React con componentes funcionales y Hooks; la EFT reúne las tres tecnologías
en un sitio nuevo y lo acompaña de una versión en React del mismo catálogo.

Portada publicada: https://ign14.github.io/DF1_ExpSumativas/

| | Entrega | Contenido | Sitio |
|---|---|---|---|
| **1** | Semana 3 | HTML5 semántico, modelo de cajas, Flexbox, CSS Grid y media queries | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp1-semana3/) |
| **2** | Semana 6 | Bootstrap 5, manipulación del DOM, eventos, Fetch API y manejo de errores | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp2-semana6/) |
| **3** | Semanas 7 y 8 | React con componentes funcionales, useState, useEffect y renderizado condicional | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp3-semana8/) |
| **EFT** | Semana 9 | Tienda con HTML5, CSS3, Bootstrap 5 y JavaScript, más el mismo catálogo en React | [Tienda](https://ign14.github.io/DF1_ExpSumativas/eft-semana9/) · [React](https://ign14.github.io/DF1_ExpSumativas/eft-semana9/panel/) |

## Estructura

```
DF1_ExpSumativas/
├── index.html              Portada con acceso a todas las entregas
├── exp1-semana3/           HTML y CSS
├── exp2-semana6/           Bootstrap 5 y JavaScript
├── exp3-semana8/           React + Vite (código en app/, build en la raíz)
└── eft-semana9/            Evaluación final: tienda completa y versión React en panel/
```

## Ejecutar en local

La Experiencia 1 se abre directamente en el navegador. Las demás cargan datos de forma asíncrona o
dependen de rutas relativas, así que conviene servirlas por HTTP:

```bash
git clone https://github.com/Ign14/DF1_ExpSumativas.git
cd DF1_ExpSumativas
python -m http.server 8000
```

Para trabajar sobre los proyectos React con recarga en caliente:

```bash
cd exp3-semana8      # o cd eft-semana9/panel
npm install
npm run dev
```

Cada carpeta tiene su propio README con las instrucciones detalladas de esa entrega.

## Publicación

El sitio se despliega desde la rama `gh-pages`. Cada entrega queda en su propia subruta bajo
`https://ign14.github.io/DF1_ExpSumativas/`.
