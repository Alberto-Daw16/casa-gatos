# Gremory TCG · Set 1

- `rarezas-gremory.html`: la galería con todas las cartas y rarezas, en un solo archivo. Se abre en el móvil o en el navegador.
- `RECETA.md` y `plantillas/`: qué ilustraciones generar, a qué tamaño y con qué encuadre.
- `proyecto/`: todo el código y las imágenes para volver a montarla.

## Cómo se monta

```
cd proyecto
pip install pillow
python3 build.py        # escribe ../rarezas-gremory.html
```

## Qué hay en `proyecto/`

- `galeria.src.html`: la galería (plantillas de carta, rarezas, firmas, marco base, textos de cada carta en `FICHA`).
- `holo.css`: efectos holo portados de pokemon-cards-css de Simon Goellner (GPL-3.0, licencia en `tex/`).
- `inmersiva.js`: el modo «Entrar en la carta» (WebGL2 con mapas de profundidad, partículas y música generada).
- `build.py`: lo mete todo (fuentes, texturas e imágenes en base64) en un solo HTML.
- `tex/`: texturas de los foils y el logo G.
- `capas/v`, `capas/v2`: capas de cada carta (fondo, personaje recortado, marco antiguo y miniatura). `v2` manda sobre `v`.
- `art/`: ilustraciones hechas a medida por plantilla: `ID-estandar|grabada|escapada|firmada|oro-fondo/pj.webp` y `ID-gremory-pj|obsidiana|cosmica.webp`. Si existe la de una plantilla, se usa esa; si no, se rellena con la de `capas`.
- `inm/`: imágenes y mapas de profundidad del modo inmersivo.
- `scripts/`: `nuevas.py` convierte lo que dejas en `~/Downloads/gremory-cartas/final/` y calcula las profundidades (necesita el modelo Depth Anything V2 small en ONNX como `da.onnx`); `prep.py` y `corta.py` son los recortes de las cartas antiguas; `guias.py` dibuja las guías de encuadre.

Los ID de carta: `alberto`, `cristina`, `kurama-ex`, `gyukki-ex`, `kurama-gyukki-vstar`, `love-vmax`.
