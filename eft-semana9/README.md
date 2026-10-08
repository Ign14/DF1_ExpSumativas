# PixelPlay Store — Evaluación Final Transversal (Semana 9)

Sitio web de una tienda de videojuegos en línea desarrollado para la EFT de Desarrollo Frontend I
(PFY2201), Duoc UC. El proyecto entrega el caso en dos versiones que comparten los mismos datos:

- **La tienda**, en HTML5, CSS3, Bootstrap 5 y JavaScript sin frameworks. El catálogo se genera
  manipulando el DOM a partir de un objeto de JavaScript, se filtra por categoría y por búsqueda, y
  el formulario de contacto se valida antes del envío.
- **El catálogo en React**, en `panel/`. La misma interfaz resuelta con componentes funcionales y
  Hooks, con alta y baja de videojuegos sobre el estado del componente.

Sitios publicados:

- Tienda: https://ign14.github.io/DF1_ExpSumativas/eft-semana9/
- Versión React: https://ign14.github.io/DF1_ExpSumativas/eft-semana9/panel/

## Estructura

```
eft-semana9/
├── index.html              Tienda: portada, catálogo y contacto
├── css/estilos.css         Estilos propios sobre Bootstrap 5
├── js/
│   ├── datos.js            Objeto con los doce videojuegos y las categorías
│   ├── catalogo.js         Tarjetas y filtros generados con la API del DOM
│   ├── contacto.js         Validación del formulario de contacto
│   └── app.js              Punto de entrada: conecta el documento con los módulos
├── img/                    Doce portadas SVG y el logotipo
├── panel/                  Versión React (proyecto Vite)
│   ├── app/                Código fuente (src/, public/, index.html)
│   ├── scripts/            Sincronización de datos y publicación del build
│   ├── index.html          Build publicado, que es lo que sirve GitHub Pages
│   └── assets/
├── capturas/               Evidencia de funcionamiento en escritorio, tablet y móvil
└── README.md
```

## Instalación y uso

Clonar el repositorio:

```bash
git clone https://github.com/Ign14/DF1_ExpSumativas.git
cd DF1_ExpSumativas/eft-semana9
```

### La tienda

La tienda no necesita instalación ni dependencias, pero sí conviene servirla por HTTP para que la
ruta de las imágenes y los scripts se comporten igual que en producción:

```bash
python -m http.server 8000
```

Luego abrir http://localhost:8000/ en el navegador. También funciona abriendo `index.html`
directamente, porque los datos viven en `js/datos.js` y no se cargan por red.

### La versión React

Requiere Node.js 18 o superior.

```bash
cd panel
npm install
npm run dev
```

Vite levanta el servidor de desarrollo e indica la dirección en la consola (por defecto
http://localhost:5173/). Para generar el build que se publica:

```bash
npm run build
```

`npm run build` hace tres cosas: regenera `app/public/videojuegos.json` desde `../js/datos.js`,
compila con Vite y copia el resultado a la raíz de `panel/`. Ese resultado está versionado a
propósito, porque GitHub Pages sirve la rama tal como está y no ejecuta el build.

## Cómo se resuelve el caso

**Estructura y estilos.** El documento usa `header`, `nav`, `main`, `section`, `article` y `footer`,
con un encabezado por nivel y un enlace de salto al contenido. Bootstrap 5.3.3 se carga desde su CDN
con atributo `integrity`, y `css/estilos.css` agrega encima el esquema de color, las tipografías y el
tratamiento de las tarjetas. El modelo de cajas se normaliza con `box-sizing: border-box` y las
medidas repetidas viven como variables en `:root`.

**Layout responsivo.** La rejilla del catálogo usa el sistema de columnas de Bootstrap
(`row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4`). Sobre eso, hay CSS Grid propio en la lista
de ventajas de la portada, en los datos de contacto y en el resumen de la versión React; y Flexbox en
el interior de cada tarjeta, donde `margin-top: auto` empuja el precio al pie para que todas las
tarjetas de una fila terminen alineadas aunque las descripciones midan distinto.

**Componentes de Bootstrap.** Barra de navegación colapsable con `navbar-toggler`, tarjetas, campos
de formulario, botones y alertas. Los controles interactivos miden al menos 44 px de alto.

**Manipulación del DOM.** `catalogo.js` recorre el objeto de `datos.js` y construye cada tarjeta con
`document.createElement`, agrupándolas en un `DocumentFragment` antes de insertarlas. Los botones de
categoría también se generan desde los datos, y un único escucha en el contenedor atiende a todos por
delegación de eventos. El filtro combina categoría y búsqueda; la búsqueda ignora los acentos, de
modo que "accion" encuentra "Acción". Cuando ningún título coincide, la rejilla se reemplaza por un
estado vacío con un botón para volver al catálogo completo.

**Validación del formulario.** `contacto.js` revisa nombre, correo y mensaje al enviar y también al
salir de cada campo. Marca el campo con error, escribe el mensaje debajo y anuncia el resumen en un
contenedor `aria-live`, de modo que un lector de pantalla lo recibe. El envío válido confirma y
limpia el formulario; no hay servidor detrás porque el proyecto es estático.

**React.** `panel/` separa la interfaz en `BarraNavegacion`, `Filtros`, `ListaVideojuegos`,
`TarjetaVideojuego`, `ResumenCatalogo`, `FormularioVideojuego` y `FormularioContacto`. Ninguno de
ellos guarda la lista: el estado vive en `App` a través del hook `useVideojuegos`, y baja a los
componentes por props junto con las funciones que lo modifican. El hook carga `videojuegos.json` con
la Fetch API dentro de un `useEffect` con `AbortController`, revisa `response.ok` (una respuesta 404
no rechaza la promesa) y traduce cualquier fallo a un mensaje en castellano. `App` deriva la lista
filtrada y los totales con `useMemo`, y `ListaVideojuegos` decide por renderizado condicional entre
cuatro estados: cargando, error, sin resultados y lista con tarjetas.

## Verificación

Las funcionalidades se probaron de forma automatizada con Playwright en Chromium, Firefox y WebKit,
en 1440, 768 y 390 px: generación de las doce tarjetas, filtro por categoría, búsqueda sin acentos,
estado sin resultados, los tres casos de error del formulario y el envío válido, carga por Fetch,
alta y baja de videojuegos en React, y ausencia de errores de consola y de respuestas 4xx o 5xx. La
carpeta `capturas/` recoge la evidencia de cada estado.

## Autoría

Ignacio Miño Astorga — Analista Programador Computacional, Duoc UC.
Desarrollo Frontend I (PFY2201), Semana 9.

Los productos, precios, imágenes y datos de contacto son ficticios y existen solo para este ejercicio
académico.
