# PixelPlay Store — eCommerce con Bootstrap 5 y JavaScript

Actividad Sumativa Semana 6 — Desarrollo Frontend I (PFY2201), Duoc UC
Ignacio Miño Astorga

Continúa la tienda de videojuegos de la Experiencia 1, esta vez maquetada con Bootstrap 5 y
con interactividad en JavaScript. El catálogo se descarga con la Fetch API desde un JSON
local y se puede filtrar, buscar y agregar al carrito; el resumen de la compra se reescribe
en el DOM en cada cambio.

Sitio publicado: https://ign14.github.io/DF1_ExpSumativas/exp2-semana6/

## Estructura

```
exp2-semana6/
├── index.html
├── assets/
│   ├── css/estilos.css       Estilos propios sobre Bootstrap
│   ├── js/
│   │   ├── utilidades.js     Helpers compartidos
│   │   ├── datos.js          Fetch API y clasificación de errores
│   │   ├── carrito.js        Estado del carrito y su render
│   │   ├── catalogo.js       Tarjetas, filtros y buscador
│   │   └── app.js            Punto de entrada
│   ├── data/productos.json   Catálogo que consume el fetch
│   └── img/                  Logotipo, portadas y banners en SVG
└── capturas/
```

## Qué incluye

**Bootstrap 5.3.3** por CDN con hash de integridad. Barra de navegación que colapsa bajo los
992 px, con dos categorías simuladas, menú desplegable, buscador y contador de carrito.
Carrusel que rota cada 3 segundos, cuadrícula `row-cols-1 / sm-2 / lg-3` y tarjetas para los
productos.

**Carga de datos.** `datos.js` es el único módulo que sale al exterior. Envuelve la petición
en un `AbortController` con límite de 8 segundos, revisa `response.ok` —un 404 no rechaza la
promesa por sí solo— y valida que cada registro traiga los campos que la interfaz necesita.

**Manejo de errores.** Siete situaciones dan un mensaje distinto y comprensible: respuesta
404 o 500, JSON malformado, catálogo vacío, registros incompletos, conexión caída, tiempo
agotado y página abierta con `file://`. En todas se ofrece reintentar o ver un catálogo de
respaldo, rotulado como tal.

**Interacción.** Eventos `click` para agregar al carrito, ajustar cantidades, eliminar líneas
y filtrar por categoría; evento `submit` en el buscador, con validación del término y
búsqueda insensible a acentos y mayúsculas (*audifonos* encuentra *Audífonos Surround HX*).
El carrito agrupa cantidades, respeta el stock de cada producto y libera el despacho sobre
$49.990.

## Cómo ejecutarlo

La Fetch API no lee archivos locales bajo el protocolo `file://`, así que el proyecto necesita
servirse por HTTP:

```bash
cd exp2-semana6
python -m http.server 8000
```

Luego abrir http://localhost:8000. En la URL publicada funciona directamente.

## Capturas

`capturas/` contiene la estructura en escritorio, tablet y móvil, la navbar colapsada abierta,
el estado de carga y el catálogo ya cargado, el carrito con productos, el buscador, el filtro
por categoría y el mensaje de error.

## Accesibilidad

Enlace para saltar al contenido, foco visible en todos los controles, `aria-label` en
navegación, carrusel y botones del carrito, y regiones `aria-live` en el contador, el resumen
y la zona de avisos. Todos los controles accionables llegan a 44 px de alto; quedan fuera el
teléfono y el correo, que van en línea dentro de un párrafo.
