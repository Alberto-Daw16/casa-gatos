# Gremory · Set 1 · receta de ilustraciones

Cada personaje tiene **6 cartas distintas**, y cada una lleva su propia ilustración hecha a la medida de su plantilla.
Las guías de encuadre están en `plantillas/` y el banco de composiciones (qué pose y qué escena lleva cada carta) en `COMPOSICIONES.md`. Pásale la guía correspondiente al generador como referencia de composición: solo marca zonas, no hay que copiar ni sus colores ni sus textos.

Los nombres de archivo (estandar, grabada, escapada, firmada, oro, gremory) se quedan así aunque en la carta la rareza salga en inglés.

IDs: `alberto`, `cristina`, `kurama`, `gyukki`, `vstar` (los dos gatos), `vmax` (vosotros).

| Carta | Rarezas | Archivos | Tamaño | Guía |
|---|---|---|---|---|
| Estándar | Holo, Reverse, Double Holo | `ID-estandar-fondo.png` + `ID-estandar-pj.png` | 1536×1024 (3:2), los dos iguales y alineados | guía 1 |
| Grabada | Etched | `ID-grabada-fondo.png` + `ID-grabada-pj.png` | 1024×1536 (2:3), alineados | guía 2 |
| Escapada | Breakout | `ID-escapada-fondo.png` (1536×1024) + `ID-escapada-pj.png` (1024×1024) | ver guía | guía 3 |
| Firmada | Signed / Pawprint | `ID-firmada-fondo.png` + `ID-firmada-pj.png` | 1024×1536, alineados | guía 4 |
| Oro | Gold | `ID-oro-fondo.png` + `ID-oro-pj.png` | 1024×1536, alineados | guía 5 |
| Gremory | Gremory Obsidian y Cosmic | `ID-gremory-pj.png` + `ID-gremory-obsidiana.png` + `ID-gremory-cosmica.png` | 1024×1820 (9:16) | guía 6 |

Son 13 archivos por personaje. Los de `-pj` van con **fondo transparente** (o verde liso #00FF00) y los demás son solo escenario, sin personajes.

## Qué pide cada carta

- **Estándar:** la carta de diario. Plano medio, pose tranquila, escena clara. Es la misma ilustración para las tres rarezas: solo cambia el brillo.
- **Grabada:** a sangre y más atmosférica. Cuerpo casi entero, luz de contraluz y fondo con mucho detalle, que es donde luce el grabado.
- **Escapada:** el personaje está dentro del cuadro y **apenas asoma por arriba**: la coronilla, las orejas o la punta de la cola, dentro de la franja amarilla de la guía 3. Todo lo que quede más arriba no se ve. Nunca toca los bordes laterales.
- **Firmada:** retrato de póster estilo Weiß. Cuerpo girado de tres cuartos, cara a cámara, cámara un poco inclinada, pelo y ropa con viento. Deja una zona oscura y tranquila para la firma.
- **Oro:** sin firma. Pose heroica, de frente o en contrapicado, con el fondo muy detallado (se pasa a oro). El personaje queda a color, así que conviene que contraste.
- **Gremory:** la 1 de 1. Cuerpo entero, épico, con luz dramática. El mismo personaje va sobre dos escenarios: obsidiana (oscuro con vetas doradas) y cósmico (nebulosa).

## Plantilla de prompt

```
Ilustración anime 2D para carta coleccionable, [TAMAÑO] ([PROPORCIÓN]), línea limpia, cel shading.
Sigue la composición de la guía adjunta: [ZONAS DE LA GUÍA].
[PERSONAJE] en [POSE], [EMOCIÓN]. Luz principal desde arriba a la [izquierda/derecha].
Escenario: [ESCENARIO].
Sin texto, sin marcos, sin logotipos.
```

- Para `-pj`: añade `SOLO el personaje, fondo transparente, sin sombra en el suelo.`
- Para `-fondo` / `-obsidiana` / `-cosmica`: añade `SOLO el escenario, sin personajes, completo también detrás de donde iría el personaje.`

Usa siempre las mismas imágenes de referencia para las caras y la misma dirección de luz en el fondo y el personaje de cada carta.
