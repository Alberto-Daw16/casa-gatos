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

- **Fuente de verdad del código (26/10/2026):** los archivos publicados `docs/tcg/motor.js`, `juego.js`, `sobre3d.js` e `inmersiva.js` se editan directamente. `tcg_build.py` queda como historia: generó el motor del Set 1, necesita `inject.js` y `album-data-app.json` (privados, no están todos) y no lleva los cambios hechos después a mano. Para un set nuevo, sus datos se añaden al motor actual (un bloque `D2` junto a `D1`).
- **CSS:** se edita `proyecto/album/juego.css` (y `manga.css`) y se monta con `python3 taller/proyecto/album/regen_css.py` desde la raíz del repo; `--check` dice si `docs/tcg/motor.css` está al día.
- **Pruebas:** `lab/harness.mjs` necesita Playwright y una carpeta `lab/img` con imágenes de prueba (no se sube: llevan caras). `tgod.mjs` y `tpe.mjs` prueban el God Pack y la 1ª edición usando `window.TCG._prueba`.
- La documentación completa del proyecto está en el Project de Claude «CrisyAlberto» (`claude/gremory-documentacion.md`) y en `gremory-archivo` del Mac.
