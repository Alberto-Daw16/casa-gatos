# Prompt para Codex · bundle de ilustraciones de un personaje

Cambia solo el bloque «PERSONAJE» y pégalo entero.

---

Vas a generar el bundle de ilustraciones de un personaje para Gremory TCG, un juego de cartas personal.

## Lee antes de empezar

- `~/Downloads/gremory-cartas/RECETA.md`: qué cartas hay, qué archivos lleva cada una, tamaños y qué pide cada plantilla.
- `~/Downloads/gremory-cartas/plantillas/`: una guía de encuadre por plantilla, al tamaño exacto. Úsala como referencia de composición:
  - Verde: cara o cuerpo.
  - Rojo: queda tapado por texto o es zona prohibida.
  - Amarillo: zona de escape.
  - Azul: zona de firma.

  No copies sus colores ni sus textos.
- `~/Downloads/gremory-cartas/COMPOSICIONES.md`: el banco de composiciones (pose, cámara y escena). Las guías solo marcan zonas prohibidas; la composición de cada carta sale de aquí.
- `~/Downloads/gremory-cartas/refs/`: referencias de caras y de estilo. Si hay una subcarpeta con el ID del personaje, esas son las que mandan.

## PERSONAJE

- **ID:** `[alberto | cristina | kurama | gyukki | vstar | vmax]`
- **Quién es:** [descripción física breve; ej. "gato naranja atigrado, ojos ámbar"]
- **Acompañante:** [si lo hay; ej. "Absol" o "ninguno"]
- **Mundo y tema:** [ej. "cristales dorados y fuego", "cristal violeta y cosmos"]
- **Cartas a generar:** [todas | solo: estandar, grabada, escapada, oro]
- **Composiciones:** [ej. estandar = 1 (lanza la Poké Ball, Absol saltando) · grabada = 3 · escapada = 10 · oro = 8 — si no pongo nada, usa el reparto de COMPOSICIONES.md]

## Qué generar

Por cada carta pedida, sigue su guía y la RECETA:

| Carta | Archivos | Tamaño |
|---|---|---|
| estandar | `ID-estandar-fondo.png` + `ID-estandar-pj.png` | 1536×1024, los dos |
| grabada | `ID-grabada-fondo.png` + `ID-grabada-pj.png` | 1024×1536, los dos |
| escapada | `ID-escapada-fondo.png` (1536×1024) + `ID-escapada-pj.png` (1024×1024) | ver guía 3 |
| firmada | `ID-firmada-fondo.png` + `ID-firmada-pj.png` | 1024×1536, los dos |
| oro | `ID-oro-fondo.png` + `ID-oro-pj.png` | 1024×1536, los dos |
| gremory | `ID-gremory-pj.png` + `ID-gremory-obsidiana.png` + `ID-gremory-cosmica.png` | 1024×1820, los tres |

## Reglas

1. **Cada carta es una ilustración distinta** y sigue la composición que le toca del banco (cámara, tamaño del personaje, acción y escena). No la conviertas en «personaje de pie en el centro»: si la composición es de paisaje, el personaje es pequeño; si es primer plano, la cara llena la imagen.
2. **Capa `-pj`:** solo el personaje (y su acompañante), PNG RGBA con transparencia real.
   - Genéralo sobre verde liso #00FF00 y quita el croma tú.
   - Que no quede halo verde en los bordes ni en el pelo.
   - Sin sombra en el suelo.
3. **Escenario:** sigue el elemento del personaje (tabla «Escenario según el elemento» de COMPOSICIONES.md), salvo en Gremory, que lleva obsidiana y cosmos.
4. **Capas `-fondo`, `-obsidiana` y `-cosmica`:** solo escenario, opaco y sin personajes. Tiene que estar completo también detrás de donde va el personaje, sin huecos ni siluetas.
5. **Fondo y personaje de la misma carta:**
   - Mismo tamaño exacto (salvo en escapada).
   - Alineados: el personaje encaja en su sitio encima del fondo.
   - Misma dirección de luz. Dila en el prompt ("luz principal desde arriba a la izquierda") y úsala en las dos capas.
6. **Encuadre:** respeta las zonas de la guía. En grabada, la cabeza empieza por debajo del 11% de la altura. En escapada, solo cabeza, orejas, pelo o cola en la franja amarilla. Nada en la franja roja de arriba y nada tocando los bordes laterales.
7. **Estilo:** anime 2D para carta coleccionable, línea limpia, cel shading. Las caras, fieles a las referencias.
8. **Sin texto:** nada de texto, marcos, logotipos ni elementos de carta. El marco lo pongo yo.
9. **Tamaños exactos:** si el generador no da el tamaño exacto, genera a la proporción correcta y reescala. Nunca estires.

## Dónde guardarlo

- **Finales:** en `~/Downloads/gremory-cartas/final/`, con los nombres exactos de la tabla. Si ya existe un archivo con ese nombre, sobrescríbelo solo si es de este mismo personaje y carta.
- **Intermedios** (versiones en croma, descartes): en `~/Downloads/gremory-cartas/raw/ID/`.
- **Revisión:** en `~/Downloads/gremory-cartas/review/ID/`.
  - Un composite por carta, con el personaje montado sobre su fondo y la guía encima al 30% de opacidad.
  - Una hoja de contacto con todas las cartas del personaje.
- **Manifiesto:** `~/Downloads/gremory-cartas/final/manifest-ID.json` con, por archivo, `width`, `height`, `mode`, `has_alpha`, `sha256` y la dirección de luz usada.

## Comprobaciones antes de terminar

- Están todos los archivos pedidos con su nombre y tamaño exactos.
- Las capas `-pj` son RGBA y tienen píxeles transparentes de verdad.
- Los fondos son opacos y no tienen personajes.
- Ningún archivo tiene texto ni marcos.
- En cada composite, la cara cae en la zona verde y nada importante en las rojas.

Al terminar, dime qué archivos has creado y cualquier carta que no hayas podido dejar bien.
