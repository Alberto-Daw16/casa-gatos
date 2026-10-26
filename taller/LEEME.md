# Taller del TCG de Gremory

Herramientas con las que se hizo el Set 1 «Home Sweet Home». Están aquí para que el Set 2 se monte con lo mismo. La app publicada vive en `docs/`; esto no se publica en la web.

Aquí no hay nada privado: ni claves, ni ilustraciones con caras, ni la dedicatoria de la 061. Lo privado está en la carpeta `gremory-archivo` del Mac de casa (originales en alta, referencias, recuerdos y `inject.js` con la dedicatoria), en el Worker y cifrado en `docs/tcg/c/`.

## Qué hay

| Carpeta | Para qué |
|---|---|
| `proyecto/album/` | Montaje del juego: `tcg_build.py` (genera `motor.js`/`motor.css`), `build_album.py`, `set1.py` + `set1.json` + `textos.json` (datos del set), `juego.css`/`manga.css` (fuentes de `motor.css`), `regen_css.py`, `inm_build.py`, miniaturas (`thumbs.mjs`, `thumbs_webp.py`), integración de entregas (`integra_aprobadas.py`, `integra_una.py`, `convierte.py`) |
| `proyecto/` | `holo.css` (foils, de pokemon-cards-css, GPL-3.0), `inmersiva.js` (vista inmersiva WebGL2), `build.py` (galería de rarezas) y `scripts/` (preparar capas y profundidad) |
| `guias/` | Encargos para los agentes de arte: `RECETA.md`, `PROMPT-CODEX.md`, `COMPOSICIONES.md`, `INSTRUCCIONES-SET1.md` (carta a carta), `RUN-ASSETS-TCG.md` (sobres y escena), `RUN-LOGROS-Y-SELLO.md`, `ICONOS.md`, `INMERSIVA-VIDEO.md` |
| `plantillas/` | Guías de encuadre de cada plantilla (verde cara, rojo prohibido, amarillo escape, azul firma) |
| `lab/` | Arnés de pruebas con Playwright (`harness.mjs`) y las pruebas de memoria, fluidez y flujo (`tmem`, `tlay`, `tidle`, `tcast`, `tpasos`, `t061`, `tbind`) y `thumbs2.mjs` para las miniaturas |

## Ojo

- `tcg_build.py` necesita `inject.js` y `album-data-app.json`, que están en el archivo privado del Mac (no aquí).
- `docs/tcg/motor.js` y `docs/tcg/sobre3d.js` tienen cambios hechos a mano después del último `tcg_build.py` (luz que se para sola, frases de las Cosmic, capas v2, tratamientos manga, sobre 3D ligero en móvil). Si se regenera, hay que volver a meterlos.
- La documentación completa del proyecto está en el Project de Claude «CrisyAlberto» (`claude/gremory-documentacion.md`).
