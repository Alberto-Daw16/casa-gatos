# Gremory · Set 1 · iconos y piezas gráficas

Todo lo que no es ilustración y ahora está dibujado a mano en código. La idea es que Codex lo rehaga como piezas propias. Cuando existan en `~/Downloads/gremory-cartas/ui/`, las monto en lugar de las provisionales.

## Reglas para todas

- **Formato:** SVG si es un icono plano de una tinta, y PNG transparente si lleva volumen, metal o textura.
- **SVG:**
  - `viewBox="0 0 24 24"` (o el que se indique), sin fondo y sin texto.
  - Un solo color con `currentColor`, para que el código los tiña.
  - Trazo o relleno limpio, y legible a 16 px.
- **PNG:** 512×512 salvo que se indique otra cosa, transparente, centrado y con un 6% de margen.
- **Paleta Gremory:**
  - Tinta #0E1118.
  - Panel #151A24.
  - Lima #C9F24A, solo como acento.
  - Blanco roto #F4F2EE.
  - Gris #8F94A2.
  - Metal: plata fría para lo normal y oro para lo premium.
- **Colores de elemento:**
  - Hogar #3B82F6.
  - Pasión #EF4444.
  - Llama #F59E0B.
  - Cristal #8B5CF6.
  - Nosotros #EC4899.
  - Comodín #9AA1AD.
- **Estilo:**
  - Nada de emojis ni de símbolos tipográficos (★, ♥, ♛…).
  - Coherentes entre sí: mismo grosor de trazo, mismas esquinas, misma familia.
- **Referencia visual:** abre `rarezas-gremory.html` para ver dónde va cada pieza.

## 1. Elementos (marco base, coste de ataques, punto débil, aguante)

| Archivo | Formato | Qué es | Ahora |
|---|---|---|---|
| `el-hogar.svg` | SVG 24 | Hogar: una casa propia de Gremory, no la genérica | casita con chimenea |
| `el-pasion.svg` | SVG 24 | Pasión | corazón |
| `el-llama.svg` | SVG 24 | Llama | llama de dos capas |
| `el-cristal.svg` | SVG 24 | Cristal | gema facetada |
| `el-nosotros.svg` | SVG 24 | Nosotros | dos anillos entrelazados |
| `el-comodin.svg` | SVG 24 | Comodín, sirve para cualquier coste | estrella de 4 puntas |
| `orbe-marco.png` | PNG 256, transparente | El aro metálico de la moneda donde va el icono; el centro vacío (transparente) | aro plateado en CSS |

## 2. Tramas de fondo por elemento

Van en el marco y en el panel de texto, a baja opacidad. Tienen que ser mosaicos que encajen sin costura.

| Archivo | Formato | Motivo | Ahora |
|---|---|---|---|
| `trama-hogar.svg` | SVG, mosaico | tejas, ladrillo, líneas de plano de casa | tejas |
| `trama-pasion.svg` | SVG, mosaico | pétalos, corazones pequeños | corazones y pétalos |
| `trama-llama.svg` | SVG, mosaico | lenguas de fuego, brasas | llamas |
| `trama-cristal.svg` | SVG, mosaico | facetas | hexágonos facetados |
| `trama-nosotros.svg` | SVG, mosaico | anillos, lazos | anillos |

## 3. Datos de juego

| Archivo | Formato | Qué es | Ahora |
|---|---|---|---|
| `ic-habilidad.svg` | SVG 24 | Etiqueta «Habilidad» | estrella |
| `ic-debil.svg` | SVG 24 | Punto débil | escudo agrietado |
| `ic-aguante.svg` | SVG 24 | Aguante (resistencia) | escudo con check |
| `ic-siesta.svg` | SVG 24 | Siesta (coste de retirarse) | luna con z |
| `ic-aura.svg` | SVG 24 | Aura (los puntos de vida) | texto «AURA» |
| `set-s01.svg` | SVG 24 | Símbolo del Set 1, para el pie de la carta | logo G |

## 4. Rarezas (pie de la carta y selector)

| Archivo | Formato | Rareza | Ahora |
|---|---|---|---|
| `rz-holo.svg` | SVG 24 | Holo | estrella llena |
| `rz-reverse.svg` | SVG 24 | Reverse | estrella hueca |
| `rz-double.svg` | SVG 24 | Double Holo | dos estrellas |
| `rz-etched.svg` | SVG 24 | Etched | dos estrellas huecas |
| `rz-breakout.svg` | SVG 24 | Breakout | destello de 4 puntas |
| `rz-signed.svg` | SVG 24 | Signed | trazo de firma |
| `rz-pawprint.svg` | SVG 24 | Pawprint | huella |
| `rz-gold.svg` | SVG 24 | Gold | tres estrellas |
| `rz-gremory.svg` | SVG 24 | Gremory | rombo doble |

## 5. Formas (logotipos junto al nombre, como el de VSTAR)

| Archivo | Formato | Qué es | Ahora |
|---|---|---|---|
| `forma-nova.png` | PNG 1024×256 | Logotipo «NOVA» metálico (gatos sueltos) | texto en cursiva con degradado lima |
| `forma-bond.png` | PNG 1024×256 | Logotipo «BOND» (los dos gatos) | ídem |
| `forma-eternal.png` | PNG 1024×256 | Logotipo «ETERNAL» (vosotros) | ídem |

Aquí sí va texto, porque es un logotipo: letras propias y con volumen, no una fuente sin más.

## 6. Adornos de marco

| Archivo | Formato | Qué es | Ahora |
|---|---|---|---|
| `esquina.svg` | SVG 40 | Adorno de esquina del marco base; se gira para las cuatro | escuadra con rombo |
| `huella-sello.svg` | SVG 100 | La huella que se estampa en foil (Pawprint) | cinco óvalos |
| `emblema-g.png` | PNG 512 | Logo G del medallón de Gremory | logo G de la app |
| `brillo.svg` | SVG 24 | La estrellita que titila en Gremory | estrella de 4 puntas en CSS |
| `nivel-medallon.png` | PNG 256 | Medallón de nivel y coste de las Signed/Gold, en plata y en oro | círculos en CSS |

## 7. Interfaz de la galería

| Archivo | Formato | Qué es | Ahora |
|---|---|---|---|
| `ui-entrar.svg` | SVG 24 | Botón «Entrar en la carta» | marco con esquinas |
| `ui-sonido.svg` / `ui-silencio.svg` | SVG 24 | Sonido del modo inmersivo | altavoz |

## 8. Pendientes que aún no existen

- `reverso.png` (1440×2038): la parte de atrás de las cartas, con la paleta Gremory y el logo G.
- `sobre-frente.png` y `sobre-dorso.png` (1024×1792): el sobre del Set 1.

## Prompt para Codex

```
Lee ~/Downloads/gremory-cartas/ICONOS.md y genera las piezas de las secciones [1-7 | las que indique].
Respeta nombres, formatos y tamaños exactos. Los SVG van a mano, sin rasterizar, con currentColor y sin texto.
Los PNG, transparentes y sin halos.
Guárdalo todo en ~/Downloads/gremory-cartas/ui/, más una hoja de contacto en ~/Downloads/gremory-cartas/review/ui/ con todas las piezas sobre fondo #0E1118 y sobre blanco, a 16, 32 y 64 px.
Al terminar, dime qué has hecho y qué no.
```
