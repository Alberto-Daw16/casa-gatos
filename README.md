# Casa & Gatos

App de gastos + compra + cuidados de los gatos, con catálogo de precios que se actualiza solo cada lunes.

Todo gratis: la app se sirve desde GitHub Pages y el rastreador corre en los servidores de GitHub Actions.

**La app:** https://alberto-daw16.github.io/casa-gatos/

---

## Cómo funciona

    scripts/productos.json   ->  qué productos seguir (edítalo a gusto)
    scripts/manual.json      ->  precios a mano; SIEMPRE ganan al rastreador
    scripts/scrape.mjs       ->  el rastreador (sin dependencias, Node 20)
    .github/workflows/       ->  lo lanza cada lunes y hace commit del resultado
    docs/index.html          ->  la app
    docs/precios.json        ->  el catálogo que lee la app

Orden de prioridad al construir precios.json: **manual > rastreado hoy > lo que ya había**.
Si el rastreador falla, el fichero anterior se queda como está y la app sigue funcionando igual.

En la app: **Compra -> Precios -> Actualizar precios desde la nube**.

---

## Precios normales y ofertas

- **price** = el precio normal. Es el que se usa para comparar supermercados.
- **offer** = precio de oferta. Se enseña con una etiqueta y *no* cuenta al comparar, salvo que actives el interruptor "Contar ofertas al comparar".
- Un producto puede tener solo oferta (price a null); entonces aparece como *sin precio normal*.

---

## Meter precios a mano

Edita **scripts/manual.json** desde la propia web de GitHub (icono del lápiz) y añade una línea:

    { "prod": "Pechuga de pollo", "unit": "kg", "shop": "Lidl", "price": 6.29, "fecha": "2026-08-15" }

Se aplicará en la siguiente ejecución. Si lo quieres ya: pestaña **Actions** -> *Actualizar precios* -> **Run workflow**.

El campo **prod** conviene escribirlo igual que en el resto de sitios para que la app lo agrupe
(aunque la app perdona diferencias del tipo "PECHUGA POLLO" vs "Pechuga de pollo").

---

## Si el rastreador deja de sacar precios

Pasa: las webs cambian el HTML cada pocos meses. El log del Action lo dice con un aviso claro.

1. **Actions** -> última ejecución -> copia el log.
2. Pásaselo a Claude y que ajuste **scripts/scrape.mjs**.

Mientras tanto no se rompe nada: manual.json y el catálogo anterior siguen sirviendo.

Para probar en local:

    node scripts/scrape.mjs --dry           # enseña lo que sacaría, sin escribir
    node scripts/scrape.mjs --debug         # además vuelca el HTML a /tmp
    node scripts/scrape.mjs --solo-manual   # ni toca la red

---

## Notas

- Los precios de comparadores públicos son **orientativos**. Los tickets que metas en la app son el dato bueno y pisan al catálogo.
- La app guarda tus datos (gastos, tickets, cuidados) **en el móvil**, no en GitHub. Exporta la copia de vez en cuando desde Ajustes.
- Para actualizar la app, sustituye **docs/index.html**: tus datos no se tocan.
