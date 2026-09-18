# Desarrollo Frontend I (PFY2201) — Experiencias sumativas

Asignatura: **Desarrollo Frontend I (PFY2201)** · Duoc UC
Autor: **Ignacio Miño Astorga**

Repositorio con las actividades sumativas del curso. Cada experiencia es un proyecto
independiente, con su propio código, documentación y capturas.

**Portada publicada:** https://ign14.github.io/DF1_ExpSumativas/

---

## Experiencias

| | Experiencia | Contenido | Sitio | Código |
|---|---|---|---|---|
| **1** | Semana 3 — *Optimizando un sitio web con HTML, CSS y diseño responsivo* | HTML5 semántico, modelo de cajas, colores y tipografía, Flexbox, CSS Grid y media queries | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp1-semana3/) | [`exp1-semana3/`](exp1-semana3/) |
| **2** | Semana 6 — *Optimizando la lógica y rendimiento de una página web con JavaScript* | Bootstrap 5, manipulación del DOM, eventos `click` y `submit`, Fetch API y gestión de errores | [Ver](https://ign14.github.io/DF1_ExpSumativas/exp2-semana6/) | [`exp2-semana6/`](exp2-semana6/) |

Ambas experiencias comparten el mismo caso: **PixelPlay Store**, una tienda de videojuegos y
accesorios. La segunda retoma la tienda de la primera y la reconstruye con Bootstrap 5,
agregándole interactividad con JavaScript.

---

## Estructura

```
DF1_ExpSumativas/
├── index.html              # Portada con acceso a ambas experiencias
├── exp1-semana3/           # Experiencia 1 — HTML y CSS
│   ├── index.html
│   ├── css/  ·  img/
│   ├── entrega/            # Archivos con el nombre exigido por el AVA + capturas
│   └── README.md
├── exp2-semana6/           # Experiencia 2 — Bootstrap 5 y JavaScript
│   ├── index.html
│   ├── assets/css  ·  assets/js  ·  assets/data  ·  assets/img
│   ├── capturas/
│   └── README.md
├── .gitignore
└── README.md
```

---

## Ejecutar en local

La Experiencia 1 se puede abrir directamente en el navegador. La Experiencia 2 usa la Fetch
API sobre un archivo local, por lo que necesita servirse por HTTP:

```bash
git clone https://github.com/Ign14/DF1_ExpSumativas.git
cd DF1_ExpSumativas
python -m http.server 8000
# abrir http://localhost:8000
```

---

## Publicación

El sitio se despliega desde la rama `gh-pages`:

```bash
git push origin main
git push origin gh-pages
```

Cada experiencia queda accesible en su propia subruta bajo
`https://ign14.github.io/DF1_ExpSumativas/`.

---

*Reservados los derechos del material del curso a Fundación Instituto Profesional Duoc UC.*
