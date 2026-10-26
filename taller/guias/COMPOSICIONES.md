# Gremory · Set 1 · banco de composiciones

Las guías de `plantillas/` solo marcan dónde no puede ir nada (texto, nombre, banda). No dicen qué pose ni qué escena. Eso sale de aquí.

Regla: dentro de un mismo personaje no se repite composición, y en una misma carta (por ejemplo todas las Grabadas) tampoco se repite entre personajes.

## El banco

Cada composición viene de cómo se ilustran las cartas de verdad.

| Nº | Composición | Qué es | De dónde viene |
|---|---|---|---|
| 1 | Acción | En mitad de un movimiento: saltar, lanzar, correr. Diagonales fuertes, pelo y ropa en movimiento. | Cartas normales de Pokémon: el Pokémon atacando. |
| 2 | Vida cotidiana | Haciendo algo suyo en un sitio suyo (sofá, cocina, ventana). Escena con detalle, personaje a tamaño medio. | Illustration Rare: el Pokémon en su hábitat haciendo algo con carácter. |
| 3 | Paisaje | El escenario manda y el personaje es pequeño dentro de él. Mucho aire y profundidad. | Illustration Rare de paisaje. |
| 4 | Momento compartido | Dos personajes interactuando y contando algo (jugar, abrazarse, mirarse). | Special Illustration Rare: el Pokémon con su entrenador en una escena. |
| 5 | Primer plano | La cara muy cerca, una mano junto a la cara, fondo desenfocado con bokeh. | SP de Weiß Schwarz, estilo key visual de anime. |
| 6 | Por encima del hombro | De espaldas o de tres cuartos, girando la cabeza hacia cámara. | Póster de anime y SP de Weiß. |
| 7 | Desde arriba | Tumbado (cama, hierba, pétalos o cristales), visto en cenital, con el pelo o la cola extendidos. | SSP de Weiß. |
| 8 | Contrapicado heroico | Cámara baja, postura de poder, cielo o luz detrás. | Hyper Rare, Full Art de Pokémon ex. |
| 9 | Sesión de moda | Cuerpo entero, pose de modelo, fondo liso o degradado con formas simples. | Full Art de entrenador. |
| 10 | Hacia la cámara | Se acerca, alarga la mano o salta hacia el espectador; hay escorzo. | Cartas "que se salen", pensado para Escapada. |
| 11 | Contraluz | Silueta recortada por una luz fuerte detrás, con halo y partículas. | Cartas secretas y doradas. |
| 12 | Recuerdo | Un instante espontáneo, como una foto: cenando, riéndose, dormidos juntos. | Cartas de "memoria" y parallels de Weiß. |

## Escenario según el elemento

El fondo de cada ilustración sigue el elemento del personaje, igual que el marco:

| Elemento | Color | Escenario |
|---|---|---|
| Hogar (Alberto) | azul | la casa: salón de noche con lámparas cálidas, ventana con la ciudad, sofá, cocina. Azul noche con toques ámbar. |
| Pasión (Cristina) | rojo | rosas y pétalos, atardecer carmesí, telas y luces cálidas. |
| Llama (Kurama) | ámbar | fuego, brasas, sol de tarde, cristal dorado. |
| Cristal (Gyukki) | violeta | cristales, cosmos, noche violeta. |
| Nosotros (VMAX) | rosa | sitios vuestros con luz cálida y bokeh rosa. |
| Dúo de gatos (VSTAR) | ámbar + violeta | la mitad fuego, la mitad cristal. |

## Reparto propuesto

Las escenas concretas son orientativas: cámbialas por cosas vuestras de verdad.

| | Estándar | Grabada | Escapada | Firmada | Oro | Gremory |
|---|---|---|---|---|---|---|
| **alberto** | 1 · lanza la Poké Ball, Absol saltando | 3 · pequeño en una catedral de cristal enorme | 10 · alarga la mano hacia cámara | 6 · por encima del hombro | 8 · contrapicado | 11 · contraluz |
| **cristina** | 2 · leyendo en el sofá con Mimikyu | 7 · tumbada entre pétalos y cristales | 10 · se asoma apoyada en el borde | 5 · primer plano | 9 · sesión de moda | 8 · contrapicado |
| **kurama** | 1 · salta a por algo | 2 · dormido al sol en el sofá | 10 · asoma con las patas por el borde | 5 · primer plano de los ojos | 8 · sobre una roca con llamas | 11 · silueta en llamas |
| **gyukki** | 6 · mira por encima del hombro | 3 · pequeño bajo un cielo cósmico | 10 · salta hacia cámara | 7 · panza arriba visto desde arriba | 1 · zarpazo de cristal | 8 · contrapicado entre cristales |
| **vstar** | 4 · jugando juntos | 12 · dormidos hechos una bola | 10 · los dos asomados | 4 · espalda con espalda | 1 · ataque en pinza | 11 · colas en corazón a contraluz |
| **vmax** | 12 · cocinando juntos | 3 · paseando de espaldas al atardecer | 10 · selfie que se sale | 4 · él la abraza por detrás | 9 · sesión de moda en pareja | 8 · bajo las estrellas |

## Cómo se usa en el prompt

En el bloque PERSONAJE, añade por cada carta su composición del reparto, por ejemplo:

```
- Composiciones: estandar = 1 (lanza la Poké Ball, Absol saltando) · grabada = 3 · escapada = 10 · oro = 8
```
