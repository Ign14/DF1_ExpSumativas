# PixelPlay Store — eCommerce con Bootstrap 5 y JavaScript

Actividad **Sumativa Semana 6** — *Optimizando la lógica y rendimiento de una página web con JavaScript*
Asignatura: **Desarrollo Frontend I (PFY2201)** · Duoc UC
Autor: **Ignacio Miño Astorga**

Segunda experiencia del curso. Continúa la tienda de videojuegos de la Experiencia 1, ahora
maquetada con **Bootstrap 5** y dotada de interactividad con **JavaScript**: el catálogo se
descarga con la **Fetch API** desde un JSON local, y el usuario puede filtrar, buscar y armar
un carrito cuyo resumen se actualiza de forma dinámica en el DOM.

---

## 🔗 Enlaces

| Recurso | URL |
|---|---|
| Repositorio | https://github.com/Ign14/DF1_ExpSumativas |
| Sitio publicado | https://ign14.github.io/DF1_ExpSumativas/exp2-semana6/ |
| Experiencia 1 (Semana 3) | https://ign14.github.io/DF1_ExpSumativas/exp1-semana3/ |

---

## 📁 Estructura

```
exp2-semana6/
├── index.html                  # Página principal del eCommerce
├── assets/
│   ├── css/
│   │   └── estilos.css         # Estilos propios sobre Bootstrap
│   ├── js/
│   │   ├── utilidades.js       # Helpers compartidos
│   │   ├── datos.js            # Fetch API y gestión de errores
│   │   ├── carrito.js          # Estado y render del carrito
│   │   ├── catalogo.js         # Render, filtros y buscador
│   │   └── app.js              # Punto de entrada
│   ├── data/
│   │   └── productos.json      # Catálogo consumido por Fetch
│   └── img/                    # Logotipo, portadas y banners (SVG)
├── capturas/                   # Evidencia de estructura e interacciones
└── README.md
```

---

## ✅ Requisitos de la actividad y dónde se cumplen

| Criterio de la pauta | Implementación | Dónde verlo |
|---|---|---|
| 1. Bootstrap 5, maquetación y responsividad (15 pts) | Bootstrap 5.3.3 por CDN con `integrity`; sistema de cuadrículas con `row-cols-1 / sm-2 / lg-3`, carrusel de 3 s, tarjetas y utilidades de espaciado | `index.html` |
| 2. Barra de navegación funcional (15 pts) | `navbar-expand-lg` que colapsa bajo 992 px, dos categorías simuladas (Videojuegos y Accesorios), menú desplegable, buscador y contador de carrito | `index.html` · `capturas/13-movil-navbar-desplegado.png` |
| 3. Manipulación del DOM (15 pts) | Las tarjetas y las líneas del carrito se generan por completo desde JavaScript; el resumen, el contador y los totales se reescriben en cada cambio | `assets/js/catalogo.js` · `assets/js/carrito.js` |
| 4. Gestión de eventos (15 pts) | `click` para agregar, sumar, quitar, eliminar y filtrar; `submit` para el buscador con validación. Delegación de eventos en los contenedores | `assets/js/catalogo.js` · `assets/js/carrito.js` |
| 5. Fetch API (10 pts) | `fetch()` sobre `assets/data/productos.json` con `AbortController`, verificación de `response.ok` y validación de los registros recibidos | `assets/js/datos.js` |
| 6. Validaciones y gestión de errores (10 pts) | Cinco escenarios cubiertos con mensaje amigable, botón de reintento y catálogo de respaldo | `assets/js/datos.js` · `assets/js/app.js` |
| 7. Organización del código (10 pts) | Cinco módulos con una responsabilidad cada uno, patrón IIFE con API pública y comentarios en cada función | `assets/js/` |
| 8. Publicación en GitHub (10 pts) | Repositorio documentado con capturas y despliegue en `gh-pages` | Este README |

---

## ⚙️ Cómo funciona

### Carga de datos con la Fetch API

`datos.js` es el único módulo que habla con el exterior. Pide el JSON, envuelve la promesa en
un `AbortController` con límite de 8 segundos y clasifica lo que pueda salir mal antes de
devolver el control a la aplicación:

```js
return fetch(RUTA_JSON, { cache: 'no-store', signal: controlador.signal })
  .then(respuesta => {
    // fetch solo rechaza ante errores de red: un 404 llega aquí como respuesta válida
    if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status + ' ' + respuesta.statusText);
    return respuesta.json();
  })
  .then(json => validarProductos(Array.isArray(json) ? json : json.productos));
```

### Escenarios de error cubiertos

| Escenario | Mensaje mostrado al usuario |
|---|---|
| Respuesta HTTP distinta de 200 | «El servidor respondió con el estado HTTP 404 Not Found» |
| JSON sin productos | «El catálogo llegó vacío» |
| Registros sin los campos mínimos | «Los datos del catálogo no tienen el formato esperado» |
| Sin respuesta en 8 segundos | «La carga del catálogo tardó demasiado» |
| Página abierta con `file://` | Explica que el navegador bloquea `fetch` en archivos locales e indica cómo levantar un servidor |

En todos los casos se ofrecen dos salidas: **Reintentar** y **Ver catálogo de demostración**
(datos de respaldo embebidos, claramente rotulados como tales).

### Eventos implementados

| Evento | Elemento | Acción |
|---|---|---|
| `click` | Botón «Agregar al carrito» | Suma el producto, actualiza totales y muestra un *toast* |
| `click` | Botones `+` / `−` / «Eliminar» | Ajustan la cantidad o borran la línea |
| `click` | Filtros de categoría y enlaces de la navbar | Filtran el catálogo sin recargar la página |
| `click` | «Vaciar carrito» / «Ir a pagar» | Reinician el carrito |
| `submit` | Formulario de búsqueda | Valida el término, filtra y desplaza la vista al catálogo |

La búsqueda normaliza acentos y mayúsculas, de modo que *audifonos* encuentra
**Audífonos Surround HX**.

---

## ▶️ Cómo ejecutarlo

La Fetch API no puede leer archivos locales por el protocolo `file://`, así que el proyecto
necesita servirse por HTTP:

```bash
cd exp2-semana6
python -m http.server 8000
# abrir http://localhost:8000
```

También funciona directamente en la URL publicada en GitHub Pages.

---

## 📸 Capturas

| Archivo | Muestra |
|---|---|
| `01-escritorio-inicio.png` · `02-escritorio-pagina-completa.png` | Estructura en escritorio (1440 px) |
| `03-fetch-estado-carga.png` | Esqueletos mientras se resuelve la promesa |
| `04-fetch-catalogo-cargado.png` | Catálogo ya renderizado desde el JSON |
| `05-carrito-con-productos.png` | Carrito con líneas, cantidades y totales |
| `06-error-fetch.png` | Mensaje amigable ante un error de carga |
| `07-busqueda-submit.png` · `08-busqueda-otro-termino.png` | Buscador (evento `submit`) |
| `09-filtro-categoria.png` | Filtro por categoría (evento `click`) |
| `10-tablet-768.png` · `11-tablet-768-completa.png` | Estructura en tablet |
| `12-movil-390.png` · `14-movil-carrito.png` | Estructura y carrito en móvil |
| `13-movil-navbar-desplegado.png` | Navbar colapsable abierta en móvil |

---

## 🧪 Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Sintaxis de los cinco módulos JS | Sin errores |
| Validez del JSON | Correcto |
| Motores de render | Blink, Gecko y WebKit: mismo comportamiento, sin errores en consola |
| Desbordamiento horizontal | 320 a 1920 px en los tres motores, sin scroll lateral |
| Flujo del carrito | Agregar, sumar, quitar, eliminar y vaciar, con totales verificados |
| Buscador | Con resultados, sin resultados y con validación de término corto |
| Rutas de error de Fetch | 404, JSON vacío, datos inválidos y red caída |

---

## ♿ Accesibilidad

- Enlace «Saltar al contenido principal» y foco visible en todos los controles.
- `aria-label` en la navegación, los botones del carrito y el carrusel.
- Regiones `aria-live` en el contador, el resumen del carrito y la zona de avisos.
- Objetivo táctil mínimo de 44 px en navegación, filtros y controles del carrito.
- Imágenes decorativas con `alt` vacío; las informativas, con texto descriptivo.
- Soporte de `prefers-reduced-motion`.

---

## 📦 Entrega al AVA

`IgnacioMinoAstorga_PFY2201_Optimizacion_Semana6.zip` contiene esta carpeta completa
(`index.html`, `assets/` y `capturas/`).

---

*Reservados los derechos del material del curso a Fundación Instituto Profesional Duoc UC.*
