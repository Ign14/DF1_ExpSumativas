# PixelPlay Store en React

Experiencia 3 — Semanas 7 y 8 — Desarrollo Frontend I (PFY2201), Duoc UC
Ignacio Miño Astorga

Tercera versión del eCommerce. La tienda que en la Experiencia 2 funcionaba con JavaScript
sobre el DOM se reescribió en React con componentes funcionales: el catálogo se carga con
`useEffect`, el carrito y los filtros viven en `useState`, y la interfaz cambia según el
estado mediante renderizado condicional.

Sitio publicado: https://ign14.github.io/DF1_ExpSumativas/exp3-semana8/

## Estructura

```
exp3-semana8/
├── app/                        Código fuente (proyecto Vite)
│   ├── index.html
│   ├── public/
│   │   ├── productos.json      Catálogo que consume useEffect
│   │   └── img/                Portadas y logotipo en SVG
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             Compone la vista y conecta los hooks
│       ├── components/         Encabezado, Filtros, Catalogo, TarjetaProducto, Carrito
│       ├── hooks/              useProductos (carga) y useCarrito (estado del carrito)
│       ├── data/formato.js     Moneda y porcentaje de descuento
│       └── styles/global.css
├── scripts/publicar.js         Copia el build a la raíz, que es lo que sirve Pages
├── capturas/
├── index.html + assets/        Resultado compilado (generado por npm run build)
├── package.json
└── vite.config.js
```

El código fuente está en `app/` y el compilado en la raíz de `exp3-semana8/`, porque GitHub
Pages sirve la carpeta tal cual está en la rama. Por eso el build queda versionado.

## Estados con useState

| Estado | Dónde vive | Para qué |
|---|---|---|
| `productos`, `cargando`, `error` | `useProductos` | Catálogo y el resultado de su carga |
| `lineas` | `useCarrito` | Productos agregados y su cantidad |
| `categoria` | `App` | Filtro de categoría activo |
| `soloOfertas` | `App` | Interruptor que además cambia su propio texto |

Los totales no se guardan: se derivan de `lineas` con `useMemo`, de modo que nunca pueden
quedar desfasados respecto del carrito.

## Carga de datos con useEffect

`useProductos` encapsula el efecto. Pide `productos.json`, aborta a los 8 segundos, revisa
`response.ok` —un 404 llega como respuesta válida, no como rechazo— y valida que la lista
traiga registros. La función de limpieza cancela la petición y marca la carga como obsoleta
si el componente se desmonta antes de que resuelva.

El efecto depende de `intento`: el botón «Reintentar» incrementa ese contador y vuelve a
dispararlo sin recargar la página.

Cuatro situaciones dan un mensaje distinto: respuesta HTTP con error, catálogo vacío, tiempo
agotado y conexión caída. Si el build se abre con doble clic (`file://`), explica que el
navegador bloquea la lectura de archivos locales e indica cómo levantar el servidor.

## Renderizado condicional

- `Catalogo` decide entre cuatro vistas: cargando, error, sin resultados y la cuadrícula.
- `Carrito` muestra el mensaje de carrito vacío o el detalle con totales.
- El botón de cada producto pasa de «Agregar al carrito» a «En el carrito (n)», con otro
  color, y a «Sin más stock (n)» cuando se alcanza el inventario.
- El interruptor alterna entre «Ver solo ofertas» y «Viendo solo ofertas».
- El aviso de cuánto falta para el envío gratis solo aparece mientras se cobra despacho.

## Desarrollo

```bash
cd exp3-semana8
npm install
npm run dev      # servidor de desarrollo
npm run build    # compila y copia el resultado a la raíz de exp3-semana8/
```

## Capturas

`capturas/` documenta los datos cargados por `useEffect`, el carrito agregando y eliminando
productos, el botón alterno, el mensaje de carrito vacío, los filtros, el estado de error y
la aplicación en escritorio, tablet y móvil.
