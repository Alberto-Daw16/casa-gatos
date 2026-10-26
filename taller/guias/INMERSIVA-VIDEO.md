# Gremory · «Entrar en la carta» con vídeo

Solo para Gremory Cosmic. Al entrar, la carta vuela hacia la cámara y el dibujo se convierte en un vídeo corto a pantalla completa: la escena cobra vida (pelo y ropa al viento, parpadeo, respiración, partículas cósmicas, la cámara empujando despacio). Al tocar, vuelve a la carta.

El montaje lo hago yo en la app: el paso de carta a vídeo, el nombre animado y la vuelta. A Codex le toca generar el clip y, si quieres, su sonido.

## Qué pedirle a Codex

```
Genera el clip inmersivo de la carta Gremory Cosmic de [ID].

Entrada:
- ~/Downloads/gremory-cartas/final/[ID]-gremory-pj.png sobre ~/Downloads/gremory-cartas/final/[ID]-gremory-cosmica.png: móntalos y usa esa imagen como primer fotograma.

Clip:
- Vídeo imagen-a-vídeo con Seedance (o el modelo de vídeo que mejor mantenga la cara), 9:16, 1080×1920, 24 fps, entre 6 y 8 s, MP4 H.264 sin audio, menos de 8 MB.
- El primer fotograma tiene que ser idéntico a la imagen de entrada, para que el paso desde la carta no se note.
- Movimiento suave y continuo: empuje lento de cámara hacia el personaje, pelo y ropa movidos por el viento, respiración, un parpadeo, polvo de estrellas y cristales flotando, la nebulosa girando despacio.
- El personaje no cambia de pose ni de cara. Nada de cortes, zooms bruscos ni cambios de plano.
- Que el último fotograma enlace bien con el primero para poder repetirlo en bucle (o que acabe quieto, sin movimiento, para congelarlo).
- Sin texto, marcos ni logotipos.

Sonido (opcional):
- Con ElevenLabs, una pieza de 8 s: pad ambiental cósmico, campanitas y un golpe suave al entrar. MP3 de 128 kbps, sin voz.

Iteración:
- Saca capturas de los fotogramas 0, 25%, 50%, 75% y final, y compáralos con la imagen de entrada. Si la cara se deforma o el personaje cambia, repite.
- Haz como mínimo 3 variantes y quédate con la mejor.

Seguridad y gasto:
- Las claves (fal.ai, ElevenLabs) van en variables de entorno o en el llavero del sistema, nunca en archivos del proyecto ni en el repositorio.
- Pon un límite de gasto antes de empezar y dime cuánto ha costado al final.

Guarda:
- ~/Downloads/gremory-cartas/final/[ID]-inmersiva.mp4
- ~/Downloads/gremory-cartas/final/[ID]-inmersiva.mp3 (si hay sonido)
- Las variantes descartadas y las capturas, en ~/Downloads/gremory-cartas/review/[ID]/inmersiva/
```

## Qué hace la app con él

1. **Entrada:** tocas «Entrar en la carta» (o mantienes pulsada la Cosmic). La carta crece hacia ti y se desvanece mientras el vídeo se abre desde el hueco del dibujo hasta llenar la pantalla. Arranca en el primer fotograma, que es el mismo dibujo, así que no hay salto.
2. **Dentro:** el clip se reproduce en bucle con su sonido; si no hay mp3, con la música generada que ya tenemos. Aparece el nombre y «Toca para volver».
3. **Salida:** tocas y hace el camino al revés hasta quedar otra vez en la carta.

Si una carta no tiene vídeo, sigue funcionando el modo inmersivo actual, con profundidad, partículas y música generada.
