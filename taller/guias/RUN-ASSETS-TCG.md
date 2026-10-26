# Gremory TCG · encargo completo de assets (24/10/2026)

Para Valeria. **Sustituye a `RUN-SOBRES.md`**, que queda anulado. Las piezas de dentro de la carta (elementos, tramas, rarezas del pie, formas NOVA/BOND/ETERNAL) siguen en `ICONOS.md` y no se repiten aquí.

Este documento lo pide todo con medidas exactas. Si algo no está escrito aquí, pregunta en `ESTADO.md` antes de inventarlo. Si algo contradice a un documento anterior, manda este.

---

## 0. Cómo se va a usar lo que hagas (léelo antes de dibujar nada)

### Tú haces imágenes planas; yo hago el movimiento

El sobre se mueve, se dobla, brilla con la luz, la tira de arriba se rompe y se va volando con física, y el cielo tiene profundidad. **Todo eso lo hago yo con código** a partir de imágenes quietas que tú me das por capas. Por eso las capas tienen que encajar al píxel: si una capa se mueve 3 px respecto a otra, se nota.

- **No hagas** vídeos, GIF, secuencias de fotogramas, modelos 3D ni animaciones en Rive o Lottie. No hacen falta.
- **Sí haz** cada pieza por separado, en su tamaño exacto, con todo alineado a la misma rejilla que te doy en `plantillas/tcg/`.

### Por qué así (la investigación sobre 3D)

Pokémon TCG Pocket es una app nativa en Unity: su sobre es una malla 3D de verdad. Nuestra app es una web, y ahí hay tres caminos:

1. **Rive o Lottie.** Necesitan que alguien anime a mano en su editor visual. No encaja con cómo trabajamos.
2. **Un modelo 3D (glTF) hecho en Blender.** Pesa y sobra: un sobre es casi plano.
3. **Texturas planas + three.js.** Es lo que voy a hacer. Cargo la librería solo al abrir un sobre (unos 150 KB) y pinto el sobre como una lámina con muchas divisiones que yo curvo, arrugo y hago brillar. Si el móvil no puede, uso CSS 3D con las mismas imágenes.

En los dos casos uso **las mismas texturas**, así que a ti te da igual el motor: tú haces texturas buenas y bien alineadas.

### Qué hace cada capa en la animación (para que entiendas las reglas)

| Momento | Qué pasa | Qué capas tuyas se usan |
|---|---|---|
| Elegir sobre | Tres sobres flotando en carrusel; el elegido crece y los otros se apagan. El sobre se inclina siguiendo el dedo o el giroscopio (hasta 12°) y un brillo recorre las zonas metalizadas | `sobre-*.png`, `sobre-*-brillo.png`, `sobre-arrugas.png`, `logotipo-gremory.png`, cielo |
| Cortar | El dedo recorre la **línea de corte (y=250)**. La tira de arriba se va despegando desde donde empieza el corte, con su borde rasgado | `sobre-rasgado.png`, la franja 0–250 de `sobre-*.png` y de `sobre-reverso.png` |
| La tira se suelta | Sale volando con física (gravedad y un muelle que la hace temblar y girar). Al girar **se le ve el dorso**. El cuerpo del sobre se encoge un 3 % y rebota | franja 0–250 de `sobre-reverso.png` |
| Se abre | Por la abertura sale una luz del color de la mejor carta; se ve el interior plateado | `sobre-interior.png`, `destello.png`, `rayos.png` |
| Estrella fugaz | Cruza el cielo en diagonal y el cielo se tiñe del color de la rareza | `estrella-fugaz.png`, `particulas.png`; el cielo se tiñe por código |
| Pila de cartas | 5 cartas boca arriba; se pasan con el dedo. La última, si es rara, sale **boca abajo** brillando | `carta-reverso.png`, `carta-reverso-brillo.png`, `particulas.png` |
| Revelado | Pantalla completa: fondo de rareza, el personaje de la carta delante, rayos girando y el círculo mágico detrás | `splash-*.png`, `rayos.png`, `circulo-magico.svg`, `tier-*.svg` |
| Resumen | Rejilla con las 5 cartas, etiqueta «Nueva» y botones | `etiqueta-nueva.svg`, iconos `ui/` |

### Prioridades

- **P1:** sin esto no se lanza. Hazlo primero y entrégalo aunque falte lo demás.
- **P2:** lo que da el salto de calidad.
- **P3:** remates; si no da tiempo, se queda para otra tanda.

---

## 1. Reglas que valen para todo

### Estilo

- Anime 2D del Set 1: línea limpia, cel shading y una luz coherente. Personajes y gatos **idénticos a sus cartas aprobadas** en `final/s01/` (caras, colores de pelo y ojos, proporciones).
- Paleta base Gremory:
  - Granate #6B0F24 y granate oscuro #3A0814.
  - Oro #E8B64C y oro claro #FFE7A3.
  - Tinta #0E1118 y blanco roto #F4F2EE.
- Colores de cada sobre:
  - Alberto: azul #4F8DFF y azul claro #A8D4FF.
  - Cristina: rosa #FF5FA2 y rosa claro #FFC2DC.
  - Gatos: naranja #FF8A3D y lila #C9A8FF.
- Colores de rareza: los fija el código, así que **no los metas tú** salvo donde se indique:
  - Común #B9C2D4.
  - Holo #7CC7FF.
  - Rara #8F7BFF.
  - Muy rara #FFCF5A.
  - Gremory #FF5FD2.
  - Secreta #FF4F7D.

### Prohibido en todas las piezas

- Texto, letras, números, firmas o marcas de agua. La única excepción es el logotipo de la sección 2.3.
- Logos ajenos: Pokémon, Pocket, Genshin, NIKKE, High School DxD. Tampoco el emblema de la casa Gremory del anime: lo nuestro es propio.
- Emojis o símbolos tipográficos (★ ♥ ♛ ✦) pegados como texto. Una estrella dibujada a mano, sí.
- Marcos de carta, bordes o viñetas que no se pidan.
- Damero de transparencia «pintado» dentro de la imagen, halos verdes o blancos alrededor de los recortes, o bordes con dientes de sierra.
- Personajes que no sean Alberto, Cristina, Absol, Mimikyu, Kurama, Sukuna y Gyukki.

### Formatos

- **PNG de 8 bits, sRGB**, sin perfil raro.
  - `RGB`: opaco, sin canal alfa.
  - `RGBA`: transparencia real, con el borde del recorte suave (1–2 px de antialias) y sin restos de fondo.
  - `L`: escala de grises de un canal (máscaras). Blanco = efecto al 100 %, negro = nada. Hazla a partir de tu propia ilustración con Python (umbral, desenfoque…) para que case al píxel; no la generes aparte.
- **SVG:** escrito a mano.
  - Solo `<path>`, `<circle>`, `<rect>`, `<g>`. Nada de `<text>`, `<image>`, scripts ni filtros.
  - El `viewBox` exacto que se pide.
  - El color siempre `currentColor` (lo tiño yo), salvo el logotipo.
  - Que se lea bien a 16 px.
- **Medidas exactas.** Ni un píxel más ni menos. Si generas a otro tamaño, reescala o recorta tú al final; no me dejes a mí ese paso.
- **Nombres:** exactamente los de las tablas, en minúsculas, sin tildes ni espacios.

### Plantillas

En `plantillas/tcg/` tienes guías a tamaño real con las zonas pintadas. Ábrelas como capa encima de tu trabajo para comprobar que todo cae donde debe. Las plantillas **no se entregan** ni se mezclan con la imagen.

| Plantilla | Para qué |
|---|---|
| `plantilla-sobre.png` | Las zonas del sobre (línea de corte, logo, cara, nombre) |
| `sobre-silueta.png` | La forma real del sobre (el dentado lo recorto yo) |
| `plantilla-cielo-vertical.png`, `plantilla-cielo-horizontal.png` | Lo que se ve, el margen de paralaje y el centro despejado |
| `plantilla-tejados.png` | La franja de Manises y dónde va la torre |
| `plantilla-splash.png` | Los recortes de móvil y ordenador y dónde va el personaje |
| `plantilla-reverso-carta.png` | El hueco del logo y las esquinas |
| `plantilla-estrella-fugaz.png` | Dónde va la cabeza y hacia dónde la cola |
| `plantilla-particulas.png` | La rejilla 4×4 y qué va en cada celda |

---

## 2. El sobre (P1 y P2)

Medida común de **todas** las capas del sobre: **1000 × 1700 px**, mismo origen arriba a la izquierda. Todas se apilan una encima de otra sin desplazar nada.

### Zonas (mira `plantilla-sobre.png`)

| Franja (y en px) | Qué es | Regla |
|---|---|---|
| 0–56 | Sellado de arriba | La ilustración **llega hasta el borde**; el dentado lo recorto yo con la silueta |
| 56–238 | La tira que se arranca | Decorativa: puede llevar la parte alta del fondo (cielo, pétalos, llamas). Nada importante, porque se va |
| **238–262** | **Línea de corte, y=250** | Franja limpia: ni caras, ni ojos, ni manos, ni detalles finos. Se rompe justo ahí |
| 262–560 | Zona del logo | Fondo tranquilo, de poco contraste. Encima pongo el logotipo (caja de 760×220 centrada en x=500, y=410). Puede asomar pelo u orejas por detrás, nunca la cara |
| 560–1380 | Zona del personaje | El protagonista. **La cara entre y=600 y y=1000**, centrada en x=500 ± 120 |
| 1380–1600 | Zona del nombre | Fondo tranquilo. Ahí escribo «Sobre de Alberto», etc. |
| 1600–1700 | Margen y sellado de abajo | La ilustración sigue hasta el borde |
| x 0–60 y 940–1000 | Laterales | Se curvan en 3D: nada importante a menos de 60 px del borde |

### 2.1 Las tres portadas · P1

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-alberto.png` | 1000×1700 | RGB |
| `sobre/sobre-cristina.png` | 1000×1700 | RGB |
| `sobre/sobre-gatos.png` | 1000×1700 | RGB |

**Qué es.** La cara del sobre, como las portadas de Pocket: un personaje grande, potente, que se reconozca aunque el sobre se vea a 200 px de alto en el carrusel.

**Cómo:**

- La ilustración ocupa **todo el lienzo, a sangre**: no dejes bordes, marco ni fondo liso alrededor. El sobre es la ilustración.
- Plano medio o medio-largo, ligeramente desde abajo (contrapicado suave) para que impongan.
- Luz principal desde arriba a la izquierda, contraluz del color del sobre.
- Fondo con profundidad pero que no compita: el contraste fuerte, en el personaje.
- Un elemento que «rompa» la franja del logo por detrás (una oreja, un mechón, una llama, el cuerno de Absol) da sensación de volumen. Solo uno, y nunca tapando el centro de la caja del logo.

**Qué sale en cada uno:**

- **`sobre-alberto.png`**
  - Alberto (tipo Agua) con Absol a su lado, los dos mirando a cámara. Pelo castaño corto, ojos marrones, barba corta unida al bigote (`refs/alberto/`, `final/s01/s01-006-*`).
  - Ropa: chaqueta oscura abierta sobre camiseta, de diario.
  - Fondo: noche junto al agua, con reflejos y salpicaduras suspendidas en el aire alrededor. Azules #4F8DFF / #A8D4FF.
  - Absol con la melena blanca al viento hacia la derecha.
- **`sobre-cristina.png`**
  - Cristina (tipo Hada) sonriendo, con Mimikyu en brazos o asomando por su hombro (`final/s01/s01-012-*`, `s01-016-*`).
  - Ropa de diario en tonos claros.
  - Fondo: pétalos, flores y lucecitas de hada flotando. Rosas #FF5FA2 / #FFC2DC.
  - Mimikyu fiel al Pokémon, con su disfraz de trapo.
- **`sobre-gatos.png`**
  - Los tres gatos juntos, en pirámide:
    - **Sukuna** (Maine Coon negro, enorme, pinceles en las orejas, melena, cola gigante) detrás y en el centro, claramente el más grande.
    - **Kurama** (naranja) a la izquierda.
    - **Gyukki** (siamesa, cuerpo claro, puntas oscuras, ojos azules) a la derecha.
  - Cada uno con su energía detrás: brasas y fuego (Kurama), sombra y humo negro-rojizo (Sukuna), cristales violetas (Gyukki), que se mezclan en el centro.
  - Dominante naranja #FF8A3D con lila #C9A8FF. Colores de pelo: los de sus cartas (`final/s01/s01-021`…`041`).

**No hagas:**

- Texto, logo ni nombre.
- Marco o borde dibujado.
- Personaje cortado por la línea de corte.
- Cara fuera de la franja 600–1000.
- Fondo negro plano.
- Más personajes de la cuenta.
- Poses de Pokémon oficiales copiadas.

### 2.2 El dorso del sobre · P1

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-reverso.png` | 1000×1700 | RGB |

**Qué es.** La parte de atrás del sobre. Se ve cuando el carrusel gira y, sobre todo, **en la tira que sale volando** (franja 0–250).

**Cómo:**

- Granate #6B0F24 con una trama sutil de rombos o escamas en oro al 15 %.
- Una **costura vertical central** (la solapa de cierre de los sobres reales): una banda de 70 px en x=465–535, un poco más clara y con relieve.
- En el centro, un emblema G grande en oro, a la altura y=850, de unos 320 px, dibujado por ti (puedes partir de `proyecto/tex/logo-g.png`, sin copiarlo tal cual).
- **El mismo para los tres sobres.**

**No hagas:**

- Texto legal, códigos de barras ni números.
- Detalles finos en la franja 238–262.

### 2.3 El logotipo · P1 (SVG) y P2 (PNG)

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/logotipo-gremory.svg` | viewBox 0 0 760 220 | SVG |
| `sobre/logotipo-gremory.png` | 1520×440 | RGBA |

**Qué es.** La palabra **GREMORY** con un «TCG» pequeño debajo a la derecha. Es la única pieza con letras.

**Cómo:**

- Letras **propias**, en trazados: puedes partir de una fuente con licencia libre (OFL) y retocarla. Apunta cuál en `LICENCIAS.md`.
- Serifa afilada, elegante, algo de fantasía; la G inicial más grande, con un remate de ala de murciélago o de cuerno que la haga reconocible.
- **SVG:** plano, en dos colores (#E8B64C las letras y #3A0814 un contorno de 6 unidades).
- **PNG:** la misma forma con volumen: oro metálico con biselado, brillo arriba, sombra interior y un contorno oscuro para que se lea sobre cualquier portada.

**No hagas:**

- Imitar el logo de Pokémon (letras amarillas con borde azul) ni el de High School DxD.
- Degradados arcoíris.

### 2.4 Borde rasgado · P1

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-rasgado.png` | 1000×64 | RGBA |

**Qué es.** El borde roto del papel metalizado. Lo pego a los dos lados de la línea de corte: en la tira que se va y, en espejo, en el cuerpo del sobre.

**Cómo:**

- Una línea irregular a lo largo de toda la franja, centrada en y=32, que sube y baja entre y=14 y y=50, con picos pequeños y alguno grande.
- Debajo de la línea: la capa interna del envoltorio, blanca y plateada (#E9ECF2 a #B8C0CC), con fibras deshilachadas y algún brillo.
- Por encima de la línea: transparente.
- **Tileable en horizontal:** el borde izquierdo tiene que empalmar con el derecho (misma altura en x=0 y x=999).

**No hagas:**

- Una línea recta o un zigzag regular de tijera.
- Colores del sobre: esto es neutro, vale para los tres.

### 2.5 Máscaras de brillo · P2

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-alberto-brillo.png` | 1000×1700 | L |
| `sobre/sobre-cristina-brillo.png` | 1000×1700 | L |
| `sobre/sobre-gatos-brillo.png` | 1000×1700 | L |
| `sobre/sobre-reverso-brillo.png` | 1000×1700 | L |

**Qué es.** Dónde brilla el metalizado cuando el sobre se inclina:

- Blanco: brillo holográfico fuerte (los bordes del sobre, salpicaduras, pétalos, llamas, el contorno del personaje).
- Gris 40 %: un poco.
- Negro: nada (caras, piel, ojos).

**Cómo:** sale de tu propia portada, para que case al píxel. Las caras y la piel, **siempre negras**: si brillan, parecen sudadas.

### 2.6 Arrugas · P2

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-arrugas.png` | 1000×1700 | L |

**Qué es.** Un mapa de alturas del envoltorio metálico: gris medio (128) = plano, más claro = sube, más oscuro = baja. Con él calculo cómo rebota la luz.

**Cómo:**

- Arrugas suaves y largas, sobre todo cerca del sellado de arriba y de abajo, y en los laterales.
- El centro, casi liso.
- Una muesca horizontal suave en y=250 (donde está la línea de corte).
- **El mismo para los tres sobres.**

**No hagas:**

- Ruido fino de grano.
- Arrugas en la zona de la cara (y 560–1000, x 300–700).

### 2.7 Sellado · P2

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-sellado.png` | 1000×56 | RGBA |

**Qué es.** La textura del sellado térmico, las estrías verticales de los extremos del sobre. La pongo encima de la ilustración, arriba y (girada) abajo.

**Cómo:**

- Estrías verticales finas cada 8 px, en gris neutro: claras y oscuras alrededor de un 50 %, con un alfa del 60 %.
- Tileable en horizontal.

### 2.8 Interior · P3

| Archivo | Medida | Modo |
|---|---|---|
| `sobre/sobre-interior.png` | 1000×420 | RGB |

**Qué es.** Lo que se ve por la abertura cuando la tira se va: el interior plateado del envoltorio, más oscuro hacia abajo, con un brillo en el borde de arriba. Asoman los cantos superiores de un taco de cartas con el dorso granate (5 cantos apilados, ligeramente desordenados).

**No hagas:** caras de cartas ni ilustraciones dentro.

---

## 3. La escena (P1 y P2)

El cielo de fondo de toda la apertura. Va en capas para darle profundidad: cuando inclinas el móvil, cada capa se mueve distinto.

**Regla de paralaje.** Cada capa es más grande que la pantalla (1440×2560 para un móvil de 1080×1920). El margen de fuera se ve al moverse, así que **tiene que seguir siendo cielo**, sin cortes ni bordes.

### 3.1 Cielo · P1

| Archivo | Medida | Modo |
|---|---|---|
| `escena/cielo-vertical.png` | 1440×2560 | RGB |
| `escena/cielo-horizontal.png` | 2560×1440 | RGB |

**Qué es.** Cielo de noche anime, bonito y tranquilo. Es el mismo cielo en los dos formatos (no uno recortado del otro: recompón).

**Cómo:**

- Degradado de azul tinta arriba (#0B1230) a azul más vivo abajo (#2B3A8F), con un resplandor más claro (#4A5FC0) en el tercio de abajo, donde estará el horizonte.
- Estrellas de tres tamaños: muchas pequeñas, bastantes medianas y unas 12 grandes con un destello suave. Alguna vía láctea tenue en diagonal.
- **El centro (círculo de la plantilla) más limpio:** pocas estrellas grandes ahí, porque encima van el sobre y las cartas.
- **En azul neutro.** Yo lo tiño por código a morado, dorado o rosa según la rareza, y si tú metes colores cálidos, el tinte se ensucia.
- **Sin tejados ni nubes:** van en sus capas.

**No hagas:**

- Luna grande en el centro.
- Fondo negro.
- Planetas.
- Texto en las estrellas o constelaciones reconocibles.

### 3.2 Nubes · P2

| Archivo | Medida | Modo |
|---|---|---|
| `escena/nubes-vertical.png` | 1440×2560 | RGBA |
| `escena/nubes-horizontal.png` | 2560×1440 | RGBA |

**Qué es.** Nubes finas y alargadas de anime, en azul lavanda claro (#9FB0E8) con el borde iluminado.

**Cómo:**

- Repartidas por arriba y por los lados, alfa entre 30 % y 80 %.
- El círculo central de la plantilla, **vacío**.
- Que encajen con su cielo.

### 3.3 Tejados de Manises · P1

| Archivo | Medida | Modo |
|---|---|---|
| `escena/tejados.png` | 2560×720 | RGBA |

**Qué es.** La silueta del pueblo abajo del todo: tejados de teja árabe, antenas, algún tendedero y la **torre de la iglesia** (campanario de base cuadrada con remate).

**Cómo (mira `plantilla-tejados.png`):**

- Siluetas en azul muy oscuro (#0A0F24), un tono más claro en los tejados más lejanos para dar dos planos.
- 6–10 ventanas encendidas en ámbar (#FFC56B), pequeñas, con un halo suave.
- **La torre en x 1100–1460**, para que se vea también en el móvil (que solo muestra los 1080 px centrales).
- Nada por encima de y=180 salvo la torre. De y=520 para abajo, relleno opaco.
- Los extremos izquierdo y derecho, sin edificios cortados a la mitad.

**No hagas:**

- Edificios altos de ciudad.
- Mar.
- La Ciudad de las Artes (eso es Valencia, no Manises).

### 3.4 Estrella fugaz · P2

| Archivo | Medida | Modo |
|---|---|---|
| `escena/estrella-fugaz.png` | 1024×256 | RGBA |

**Qué es:**

- Cabeza brillante en **(900, 128)**: un núcleo blanco de unos 24 px con un destello en cruz de unos 140 px.
- Cola hacia la izquierda: estela que se adelgaza y se desvanece a transparente antes de x=40, con alguna chispa suelta.

**Cómo:** solo blanco y grises, sin color: la tiño yo según la rareza.

### 3.5 Rayos · P2

| Archivo | Medida | Modo |
|---|---|---|
| `escena/rayos.png` | 2048×2048 | RGBA |

**Qué es.** Haz de rayos de luz que sale del **centro exacto (1024, 1024)**: unos 18 rayos de anchos distintos, en blanco.

**Cómo:**

- Más opacos cerca del centro y a cero en el borde. Las esquinas, totalmente transparentes.
- Simetría aproximada, sin ser perfecta: lo giro despacio y debe verse orgánico.

### 3.6 Partículas · P2

| Archivo | Medida | Modo |
|---|---|---|
| `escena/particulas.png` | 512×512 | RGBA |

**Qué es.** Un atlas de 4×4 celdas de 128×128 px. Cada partícula va **centrada en su celda, con 8 px de margen** y sin tocar a la vecina.

Las celdas 0–3 y 14–15 en blanco puro (las tiño yo). El resto, con su color.

| Celda | Qué | Color |
|---|---|---|
| 0 | chispa alargada | blanco |
| 1 | destello de 4 puntas | blanco |
| 2 | brillo redondo difuso | blanco |
| 3 | anillo fino | blanco |
| 4 | pétalo | rosa #FFC2DC |
| 5 | flor pequeña de 5 pétalos | rosa #FF5FA2 |
| 6 | gota de agua | azul #A8D4FF |
| 7 | burbuja | azul translúcido |
| 8 | brasa | naranja #FF8A3D |
| 9 | llamita | naranja-amarillo |
| 10 | esquirla de cristal | violeta #8B5CF6 |
| 11 | voluta de sombra | negro-rojizo #3A0814 |
| 12 | huella de gato | oro #E8B64C |
| 13 | corazón dibujado | rosa #FF5FD2 |
| 14 | polvo (3 puntos) | blanco |
| 15 | confeti rectangular | blanco |

### 3.7 Círculo mágico · P2

| Archivo | Medida | Modo |
|---|---|---|
| `escena/circulo-magico.svg` | viewBox 0 0 1000 1000 | SVG |

**Qué es.** El círculo que gira detrás del revelado y bajo el sobre al abrirlo. Propio de Gremory, **no** el del anime.

**Cómo.** Centrado en (500, 500), solo trazos (`stroke="currentColor"`, `fill="none"`), en cinco grupos con estos `id` exactos, porque giro cada uno a una velocidad:

- `anillo-ext`: dos circunferencias (r=490 y r=470) con marcas cortas cada 6°.
- `runas`: entre r=470 y r=400, una corona de **glifos inventados** (no letras latinas, griegas, japonesas ni runas reales), unos 36.
- `anillo-med`: una circunferencia en r=390 y un heptagrama (estrella de 7 puntas) inscrito.
- `anillo-int`: dos circunferencias (r=230 y r=215) con 3 pequeños medallones (ojos de gato estilizados) a 120°.
- `estrella`: en el centro, el emblema G de trazo fino, de unos 260 px.
- Grosores de trazo entre 2 y 6 unidades.

### 3.8 Destello · P3

| Archivo | Medida | Modo |
|---|---|---|
| `escena/destello.png` | 1024×1024 | RGBA |

Estallido de luz para el instante en que se suelta la tira: un núcleo blanco y un anillo de luz con 6–8 puntas finas, centrado. Solo blanco; las esquinas, transparentes.

---

## 4. Cartas (P1 y P2)

### 4.1 Dorso de las cartas · P1

| Archivo | Medida | Modo |
|---|---|---|
| `cartas/carta-reverso.png` | 1440×2038 | RGB |

**Qué es.** La parte de atrás de todas las cartas (es el doble de la carta en pantalla, 720×1019).

**Cómo (mira `plantilla-reverso-carta.png`):**

- Fondo granate oscuro (#3A0814 a #6B0F24 hacia el centro) con una trama muy sutil de escamas.
- Marco ornamental fino en oro (#E8B64C) a 48 px del borde, con las cuatro esquinas trabajadas (filigrana, un pequeño ojo de gato).
- **Simétrico en los dos ejes:** la carta tiene que verse igual del derecho y del revés, como un dorso de verdad.
- En el centro, **un hueco circular de Ø680 libre**, liso, un poco más oscuro: ahí pongo el logo G animado.
- Las esquinas se recortan con radio 72 px: no pongas nada importante ahí.

**No hagas:**

- El dorso de Pokémon (la bola roja y blanca y el azul).
- El logo de Pokémon.
- Texto.

### 4.2 Brillo del dorso · P2

| Archivo | Medida | Modo |
|---|---|---|
| `cartas/carta-reverso-brillo.png` | 1440×2038 | L |

Máscara: blanco el oro del marco y las filigranas, gris 30 % la trama, negro el resto. Hecha desde `carta-reverso.png`.

### 4.3 Fondos de revelado · P2

| Archivo | Medida | Modo | Rareza |
|---|---|---|---|
| `cartas/splash-holo.png` | 2160×2160 | RGB | Holo |
| `cartas/splash-rara.png` | 2160×2160 | RGB | Rara |
| `cartas/splash-muyrara.png` | 2160×2160 | RGB | Muy rara |
| `cartas/splash-gremory.png` | 2160×2160 | RGB | Gremory |
| `cartas/splash-secreta.png` | 2160×2160 | RGB | Secreta |

**Qué es.** El fondo a pantalla completa del revelado, como en Genshin o NIKKE. Delante pongo yo al personaje recortado de la carta.

**Cómo:**

- Cuadrados para que valgan en vertical y en horizontal (mira `plantilla-splash.png`).
- **Todo lo importante dentro del círculo central de Ø1080.**
- El punto más brillante, justo encima del centro (donde irá el pecho del personaje). Oscurece hacia los bordes como una viñeta.
- Abstractos: sin personajes, sin suelo y sin horizonte. Cada uno, más espectacular que el anterior:

| Rareza | Qué |
|---|---|
| Holo | Azul cielo #7CC7FF: nebulosa suave y destellos |
| Rara | Violeta #8F7BFF: nebulosa más densa, cristales flotando desenfocados |
| Muy rara | Oro #FFCF5A: rayos de luz dorada, polvo de oro, filigrana de fondo |
| Gremory | Rosa #FF5FD2 y granate: pétalos, alas de murciélago de luz difusas a los lados, mucho brillo |
| Secreta | Granate #6B0F24 y rosa #FF4F7D: corazón de luz muy difuso detrás, estrellas, ambiente íntimo y cálido |

**No hagas:**

- Personajes.
- Texto.
- Estrellas o gemas de rareza dibujadas (las pongo yo con los SVG).

### 4.4 Marcas de rareza · P2

| Archivo | Medida | Modo |
|---|---|---|
| `cartas/tier-gema.svg` | viewBox 0 0 24 24 | SVG |
| `cartas/tier-gremory.svg` | viewBox 0 0 24 24 | SVG |
| `cartas/tier-secreta.svg` | viewBox 0 0 24 24 | SVG |

En el revelado salen en fila: 1 a 4 gemas según la rareza, la de Gremory sola o la secreta sola.

- **Gema:** un rombo facetado propio (dos facetas visibles), que **no** sea el diamante de Pocket.
- **Gremory:** la gema con dos alitas de murciélago.
- **Secreta:** una cerradura con forma de corazón.
- Relleno `currentColor`; se tiene que entender a 16 px.

### 4.5 Etiqueta «Nueva» · P2

| Archivo | Medida | Modo |
|---|---|---|
| `cartas/etiqueta-nueva.svg` | viewBox 0 0 120 40 | SVG |

Solo la forma, **sin texto** (la palabra la pongo yo):

- Una cinta con el extremo izquierdo recto y el derecho en cola de golondrina.
- Relleno `currentColor`.
- Un brillo diagonal arriba con `fill-opacity` 0.3.

### 4.6 Sello de primera edición · P3

| Archivo | Medida | Modo |
|---|---|---|
| `cartas/sello-primera-edicion.png` | 512×512 | RGBA |

Sello redondo propio de Gremory, en oro con relieve:

- Un emblema con la silueta de las tres cabezas de gato y una pequeña corona encima.
- Un hueco liso abajo para el número (lo pongo yo).
- Fondo transparente y 6 % de margen.
- **Que no se parezca** al sello «Edition 1» de Pokémon (el círculo negro con el 1).

---

## 5. Interfaz (P2 y P3)

### 5.1 Iconos · P2

Todos **SVG, viewBox 0 0 24 24, `currentColor`**:

- Trazo de 1,75 con extremos y uniones redondeados, rejilla de 24, 2 px de margen.
- Misma familia que los de `ICONOS.md`.

| Archivo | Qué | Cómo |
|---|---|---|
| `ui/ic-sonido.svg` | Sonido activado | Altavoz con dos ondas |
| `ui/ic-silencio.svg` | Silencio | El mismo altavoz con una cruz donde iban las ondas |
| `ui/ic-cerrar.svg` | Cerrar | Aspa |
| `ui/ic-atras.svg` | Anterior | Chevron izquierdo |
| `ui/ic-siguiente.svg` | Siguiente | Chevron derecho |
| `ui/ic-sobre.svg` | Pestaña «Sobres» | Un sobre de cartas de perfil con el dentado arriba (no un sobre de correo) |
| `ui/ic-carpeta.svg` | Pestaña «Álbum» | Carpeta de anillas abierta con dos cartas |
| `ui/ic-cambio.svg` | Pestaña «Cambios» | Dos cartas con dos flechas en círculo |
| `ui/ic-saltar.svg` | Saltar animación | Dos chevrons con una barra |
| `ui/ic-reloj.svg` | Próximo sobre | Reloj de arena |
| `ui/ic-candado.svg` | Bloqueado | Candado |
| `ui/ic-logro.svg` | Logros | Medalla con cinta |
| `ui/ic-repetida.svg` | Cartas repetidas | Dos cartas desplazadas |
| `ui/ic-filtro.svg` | Filtrar | Embudo |
| `ui/ic-info.svg` | Información | Círculo con una «i» dibujada como trazos (no texto) |

### 5.2 Estados vacíos · P3

| Archivo | Medida | Modo | Qué |
|---|---|---|---|
| `ui/vacio-sin-sobres.png` | 1200×900 | RGBA | Los tres gatos dormidos encima de un montón de sobres abiertos, con Kurama despatarrado. Para «ya has abierto los de hoy» |
| `ui/vacio-sin-conexion.png` | 1200×900 | RGBA | Sukuna mordiendo un cable de red, con Gyukki mirando con cara de culpa. Para «sin conexión» |

Fondo transparente, sin suelo dibujado (como mucho, una sombra suave debajo) y personajes fieles a sus cartas.

### 5.3 Tapa del álbum · P3

| Archivo | Medida | Modo |
|---|---|---|
| `ui/tapa-carpeta.png` | 1200×1600 | RGB |

La tapa del archivador de cartas:

- Cuero granate con costura dorada en el borde, a 40 px.
- Tres anillas metálicas asomando en el lomo izquierdo.
- En el centro, un medallón dorado con el emblema G.
- Desgaste leve en las esquinas.
- Sin texto.

### 5.4 Medallas de logro · P3

| Archivo | Medida | Modo |
|---|---|---|
| `ui/medalla-bronce.png` | 512×512 | RGBA |
| `ui/medalla-plata.png` | 512×512 | RGBA |
| `ui/medalla-oro.png` | 512×512 | RGBA |

Una medalla redonda con cinta granate. El **centro, un disco liso de Ø260**: ahí meto yo el icono del logro. Metal con biselado, fondo transparente y 6 % de margen.

---

## 6. Sonido (P3, opcional)

Solo si puedes hacerlo bien. Si no, sigo con el sonido sintetizado que ya hay.

- Formato: `.mp3`, 44,1 kHz, mono.
- Volumen: pico a −1 dB, sin silencio al principio.
- Origen: solo **CC0** o hecho por ti (anótalo en `LICENCIAS.md`). Nada sacado de Pokémon, Genshin ni otros juegos.

| Archivo | Duración | Qué |
|---|---|---|
| `sonido/corte.mp3` | 0,6 s | Papel metalizado rasgándose despacio |
| `sonido/rasgado.mp3` | 0,4 s | El tirón final que suelta la tira |
| `sonido/sobre-sale.mp3` | 0,8 s | «Whoosh» suave |
| `sonido/estrella.mp3` | 1,2 s | Campanillas que suben |
| `sonido/reparte.mp3` | 0,15 s | Una carta que se desliza |
| `sonido/voltea.mp3` | 0,25 s | Una carta que se da la vuelta |
| `sonido/rara.mp3` | 1,5 s | Acorde brillante |
| `sonido/gremory.mp3` | 2,5 s | Acorde grande con coro suave |
| `sonido/miau-kurama.mp3`, `miau-sukuna.mp3`, `miau-gyukki.mp3` | 0,5–1 s | Un maullido distinto por gato: Sukuna grave, Gyukki agudo y hablador |
| `sonido/ambiente.mp3` | 40 s en bucle perfecto | Noche tranquila, pad suave y grillos lejanos, a −24 LUFS |

---

## 7. Entrega

**Carpeta:** `~/Downloads/gremory-cartas/entregas/tcg-assets/`, con las subcarpetas `sobre/`, `escena/`, `cartas/`, `ui/` y `sonido/`. Los intentos descartados, en `_descartes/`. **No toques** `final/`, `proyecto/` ni `subir-app/`.

**Al terminar cada tanda:**

1. Pasa el comprobador, que revisa nombres, medidas, modos, transparencias, halos verdes y SVG, y además genera la hoja de contacto:
   ```
   cd ~/Downloads/gremory-cartas
   python3 scripts/comprueba_tcg_assets.py --hoja
   ```
2. Pega su tabla en `entregas/tcg-assets/ESTADO.md`. Añade una línea por pieza con lo que has hecho y las dudas.
3. Si algo no sale tras **tres intentos**, entrega el mejor, márcalo como «provisional» en `ESTADO.md` y sigue con lo demás.
4. Fuentes y sonidos de terceros, en `LICENCIAS.md`.

**Orden de trabajo:**

1. **Tanda 1 (P1):**
   - `sobre-alberto`, `sobre-cristina`, `sobre-gatos`.
   - `sobre-reverso`, `sobre-rasgado`, `logotipo-gremory.svg`.
   - `cielo-vertical`, `cielo-horizontal`, `tejados`.
   - `carta-reverso`.
2. **Tanda 2 (P2):** máscaras, arrugas, sellado, logotipo PNG, nubes, estrella fugaz, rayos, partículas, círculo mágico, `splash-*`, `tier-*`, etiqueta e iconos.
3. **Tanda 3 (P3):** interior, destello, sello, estados vacíos, tapa, medallas y sonido.

## 8. Prompt para pegar

```
Lee ~/Downloads/gremory-cartas/RUN-ASSETS-TCG.md entero antes de empezar.
Haz la tanda [1 | 2 | 3]. Usa las plantillas de ~/Downloads/gremory-cartas/plantillas/tcg/
como guía (no se entregan). Respeta nombres, medidas, modos y zonas al píxel.
Personajes fieles a sus cartas de final/s01/. Nada de texto salvo el logotipo.
Entrega en ~/Downloads/gremory-cartas/entregas/tcg-assets/, pasa
python3 scripts/comprueba_tcg_assets.py --hoja y pega el resultado en ESTADO.md.
No toques final/, proyecto/ ni subir-app/. Al terminar, dime qué has hecho y qué no.
```
