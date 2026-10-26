# Gremory TCG · iconos de logros y sello de primera edición (25/10/2026)

Para Valeria (o Aika). Son dos encargos pequeños para el TCG de la app Gremory:

1. Los **20 iconos** que van dentro de las medallas de logro.
2. Un **sello de primera edición** nuevo, que sustituye al de la tanda anterior.

Las reglas generales de `RUN-ASSETS-TCG.md` siguen valiendo: estilo, paleta, formatos y lo prohibido. Si algo de aquí choca con ese documento, manda este. Si algo no está escrito, pregunta en `ESTADO.md` antes de inventarlo.

---

## 0. Cómo se usa lo que hagas

- **Los logros** están en la pestaña **Logros** del TCG. Cada logro es una medalla: las `ui/medalla-bronce/plata/oro.png` que ya hiciste, de 512×512 con un disco liso de Ø260 en el centro. Dentro de ese disco va el icono, en granate #3A0814 sobre el metal.
  - Ahora mismo se usan iconos genéricos de la interfaz: el de carpeta, el de sobre, el de cambio y la gema. Se ven todos iguales y queremos que cada logro tenga el suyo. Captura de cómo está: `plantillas/logros/logros-pantalla.png`.
  - El icono se tiñe por código. En la medalla sale granate y, si el logro no está conseguido, la medalla entera sale en gris.
- **La primera edición** es una copia única de cada carta. De cada una de las 60 cartas solo existe una primera edición en todo el juego, y sale al azar al abrir sobres (un 1 %). Lleva un sello pequeño en la esquina de abajo a la derecha de la carta.
  - El sello se ve a 20–24 px en el binder y a unos 40 px en la carta grande, así que tiene que leerse bien en pequeño.
  - Ahora lleva uno provisional, hecho por código: `plantillas/logros/sello-referencia.png`. Puedes partir de él.

---

## 1. Iconos de logros · 20 piezas

| Formato | Medida | Color |
|---|---|---|
| SVG | `viewBox="0 0 24 24"` | `currentColor` (lo tiño yo) |

**Reglas:**

- **De la misma familia** que los iconos de la tanda anterior (`ui/ic-*.svg`): trazo de 1,75 con extremos y uniones redondeados y 2 px de margen. Se permiten rellenos sólidos donde ayude a leerlo.
- Solo `<path>`, `<circle>`, `<rect>` y `<g>`. Nada de `<text>`, números ni letras.
- **Que se entienda a 28 px** sobre el metal de la medalla. Pocas líneas, siluetas claras.
- Los tres niveles de un mismo logro (por ejemplo 10, 50 y 100 sobres) **se diferencian por el dibujo**, no por un número: uno, unos pocos, un montón.

**Archivos** en `entregas/logros/`:

| Archivo | Logro | Medalla | Qué dibujar |
|---|---|---|---|
| `lg-col10.svg` | Diez distintas | bronce | Una carta con un destello en la esquina |
| `lg-col30.svg` | Medio binder | plata | Binder abierto con la mitad de bolsillos llenos |
| `lg-col60.svg` | Set completo | oro | Binder cerrado con una pequeña corona encima |
| `lg-fam1.svg` | Todo Alberto | plata | Gota de agua (tipo Agua) |
| `lg-fam11.svg` | Todo Cristina | plata | Flor con dos alitas de hada (tipo Hada) |
| `lg-fam21.svg` | Todo Kurama | plata | Cabeza de gato con una llama encima (Fuego) |
| `lg-fam28.svg` | Todo Sukuna | plata | Cabeza de gato grande con pinceles en las orejas y luna creciente (Siniestro) |
| `lg-fam35.svg` | Todo Gyukki | plata | Cabeza de gato con un cristal o un ojo místico en la frente (Psíquico) |
| `lg-fam42.svg` | Todos juntos | plata | Dos manos y tres huellas juntas, o un corazón con huellas |
| `lg-fam49.svg` | Toda la casa | plata | Casa con tejado a dos aguas y una ventana encendida |
| `lg-grab.svg` | Primera Grabada | bronce | Carta con líneas grabadas en diagonal |
| `lg-esc.svg` | Primera Escapada | bronce | Silueta que se sale del marco de una carta |
| `lg-firma.svg` | Primera Firmada | bronce | Pluma haciendo un trazo de firma |
| `lg-oro.svg` | Primera Oro | plata | Carta con una corona |
| `lg-gre.svg` | Primera Gremory | oro | La gema con alas de murciélago (como `cartas/tier-gremory.svg`, más trabajada) |
| `lg-sob10.svg` | Diez sobres | bronce | Un sobre de cartas con el dentado arriba |
| `lg-sob50.svg` | Cincuenta sobres | plata | Tres sobres en abanico |
| `lg-sob100.svg` | Cien sobres | oro | Montón de sobres con una chispa |
| `lg-cam1.svg` | Primer cambio | bronce | Dos cartas con dos flechas en círculo |
| `lg-cam10.svg` | Diez cambios | plata | Dos huellas de gato chocando, o un apretón de manos |

---

## 2. Sello de primera edición · 1 pieza (dos formatos)

| Archivo | Medida | Modo |
|---|---|---|
| `entregas/logros/sello-primera-edicion.svg` | `viewBox="0 0 48 48"` | SVG, colores propios (no `currentColor`) |
| `entregas/logros/sello-primera-edicion.png` | 512×512 | RGBA, 6 % de margen |

**Qué es:** un sello de lacre o un medallón propio de Gremory que diga «primera edición» sin palabras.

**Cómo:**

- Oro (#E8B64C a #FFE7A3) con el centro granate (#3A0814), como el provisional.
- Dentro, un **«1ª» dibujado con trazados** (no una fuente escrita como texto). Es la única excepción a «nada de letras ni números».
- El borde, de sello de lacre: ondulado o dentado irregular. Así se distingue de una moneda.
- Un pequeño guiño Gremory que no estorbe a 20 px: una coronita encima del 1, o tres puntitos como huellas.
- **Que se lea a 20 px.** Pruébalo reducido antes de entregarlo.

**No hagas:**

- Nada que recuerde al «Edition 1» de Pokémon (círculo negro con un 1 blanco y sombra).
- Cabezas de gato en bloque, como en la tanda anterior: a tamaño pequeño se convierten en manchas.
- Texto como «1st», «Edición» o «Edition».

---

## 3. Entrega

1. Todo en `~/Downloads/gremory-cartas/entregas/logros/`, con los nombres exactos de las tablas.
2. Una **hoja de contacto** `hoja-logros.png` con los 20 iconos dibujados en granate sobre `ui/medalla-plata.png` a 64 px, y el sello a 20, 40 y 200 px.
3. En `entregas/logros/ESTADO.md`, una línea por pieza: qué has hecho y las dudas que tengas.
4. **No toques** `final/`, `proyecto/`, `subir-app/` ni `entregas/tcg-assets/`.

## 4. Prompt para pegar

```
Lee ~/Downloads/gremory-cartas/RUN-LOGROS-Y-SELLO.md entero antes de empezar.
Haz los 20 iconos de logros y el sello de primera edición. Mira las capturas de
~/Downloads/gremory-cartas/plantillas/logros/ para ver cómo se usan.
Misma familia que tus iconos ui/ic-*.svg. Nada de texto en los iconos. Respeta nombres,
medidas y formatos. Entrega en ~/Downloads/gremory-cartas/entregas/logros/ con la hoja
de contacto y ESTADO.md. No toques final/, proyecto/, subir-app/ ni entregas/tcg-assets/.
```
