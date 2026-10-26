/* Manga nocturno: presentation adapter. Never mutates catalog, art or original renderer. */
(function () {
  'use strict';
  const g = window.GTCG;
  if (!g || g.mangaTreatment) return;
  /* 25/10: las Estándar (Holo, Reverse, Double Holo) se quedan con su marco de siempre, sin fullart (lo pidió Alberto) */
  const treatments = new Map([['SR','etched'],['OFR','breakout'],['SP','signed'],['HR','gold'],['CR','gremory'],['G1','obsidian']]);
  const original = g.carta;
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  g.mangaTreatment = v => treatments.get(v) || null;
  g.carta = function (id, v) {
    const treatment = g.mangaTreatment(v);
    // G2/G3/CASA/Secret and unknown paths remain the original renderer.
    if (!treatment || id === 's01-061') return original.apply(this, arguments);
    // null is a matte presentation of the existing standard card, NOT a catalog rarity.
    const html = original.call(this, id, v === null ? 'R' : v);
    const t = document.createElement('template');
    t.innerHTML = html;
    const card = t.content.firstElementChild;
    if (!card || !card.classList.contains('carta')) return html;
    if (card.classList.contains('plana')) return html; // baked approved frame: requires editable source, never substitute old art
    card.classList.add('mg', 'mg-' + treatment, 'mg-fullart');
    card.dataset.artId = id;
    card.dataset.treatment = treatment;
    const premium = ['HR','CR','G1'].includes(v);
    if (premium) {
      card.classList.add('mg-premium');
      // Retain original images, effect nodes, material classes and inline masks.
      // Reframe subjects uniformly while keeping the original background mapping.
      // The retired CR branch emits literal "undefined" for current catalog IDs.
      // Recover only those broken references from this SAME card's real standard art;
      // never change a valid URL, and never repair/substitute missing G1/G2 assets.
      if (v === 'CR' && (g.versiones(id) || []).includes('R') && card.querySelector('img[src="undefined"]')) {
        const source = document.createElement('template');
        source.innerHTML = original.call(this, id, 'R');
        for (const img of card.querySelectorAll('img[src="undefined"]')) {
          const sameLayer = source.content.querySelector(img.classList.contains('pj') ? 'img.pj' : 'img.fondo');
          if (sameLayer && sameLayer.getAttribute('src') !== 'undefined') img.src = sameLayer.getAttribute('src');
        }
      }
      if (v === 'CR') {
        for (const img of card.querySelectorAll('img.fondo,img.pj')) img.parentElement.classList.add('mg-cr-art');
      }
      // Current Mac art: BG and PJ share one native canvas. Never move one alone.
      // Preserve all original URLs and material/effect nodes, change only geometry.
      for (const img of card.querySelectorAll('.capa-clip img.fondo,.capa-clip img.pj')) {
        img.closest('.capa-clip').classList.add('mg-art-layer');
        img.classList.add('mg-original-art');
      }
      // Replace only decorative frame geometry; retain the metallic paint on marco-g.
      const metal = card.querySelector('.marco-g');
      if (metal) {
        const geometry = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 700"><g fill="none" stroke="white"><rect x="7" y="7" width="436" height="686" rx="17" stroke-width="4"/><path d="M15 96L37 19H424L435 41V658L413 683H24L13 665Z" stroke-width="1.5"/></g></svg>';
        const mask = 'url("data:image/svg+xml,' + encodeURIComponent(geometry) + '")';
        metal.style.maskImage = mask; metal.style.webkitMaskImage = mask;
      }
    }
    // The standard art window moves as one unit. Move foil masks with it too.
    if (card.classList.contains('est')) {
      const top = 0, bottom = 1, left = 0, right = 1;
      const pc = n => (n * 100).toFixed(3) + '%';
      const clip = `inset(${pc(top)} ${pc(1-right)} ${pc(1-bottom)} ${pc(left)})`;
      const inverse = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% ${pc(bottom)},${pc(right)} ${pc(bottom)},${pc(right)} ${pc(top)},${pc(left)} ${pc(top)},${pc(left)} ${pc(bottom)},0% ${pc(bottom)})`;
      for (const suffix of ['', '-stage', '-trainer']) {
        card.style.setProperty('--clip' + suffix, clip);
        card.style.setProperty('--clip' + suffix + '-invert', inverse);
      }
      const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1019"><path fill-rule="evenodd" fill="white" d="M0 0H720V1019H0Z M${left*720} ${top*1019}H${right*720}V${bottom*1019}H${left*720}Z"/></svg>`;
      card.style.setProperty('--marco', 'url("data:image/svg+xml,' + encodeURIComponent(mask) + '")');
    }
    const frame = document.createElementNS('http://www.w3.org/2000/svg','svg');
    frame.setAttribute('class','mg-frame'); frame.setAttribute('viewBox','0 0 450 700');
    frame.setAttribute('preserveAspectRatio','none'); frame.setAttribute('aria-hidden','true');
    frame.innerHTML = '<rect x="7" y="7" width="436" height="686" rx="17" fill="none" stroke="currentColor" stroke-width="4"/><path d="M15 96L37 19H424L435 41V658L413 683H24L13 665Z" fill="none" stroke="currentColor" stroke-width="1.5"/>' + (treatment === 'breakout' ? '<g fill="#dd1739"><path d="M12 129l88-27-71 55 48-7-61 39Z M435 484l-75 66 68-23-35 38 44-14Z"/></g><path d="M22 202L422 115 M19 481L431 551" fill="none" stroke="#eee9dd" stroke-width="4"/>' : '');
    card.appendChild(frame);
    if (premium && v !== 'HR') {
      const shards = document.createElementNS('http://www.w3.org/2000/svg','svg');
      shards.setAttribute('class','mg-shards'); shards.setAttribute('viewBox','0 0 450 700'); shards.setAttribute('preserveAspectRatio','none'); shards.setAttribute('aria-hidden','true');
      shards.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="2"><path d="M20 126L421 105 430 234 M18 348L430 267 M19 531L431 468 M21 18l42 24-23 61 M432 29l-30 52 21 61 M20 463l39 37-19 58 M429 544l-31 29 20 43"/></g><g fill="#a51d36"><path d="M13 107l62-15-36 30 25-5-47 43Z M436 424l-32 53 23-10-31 47 38-22Z"/></g>';
      card.appendChild(shards);
    }
    if (treatment === 'signed' || (premium && !card.querySelector('.mb-cab'))) {
      const title = document.createElement('div'); title.className = 'mg-title';
      title.innerHTML = '<b>' + escape(g.CARTAS[id].n) + '</b><small>' + escape(g.CARTAS[id].tipo) + ' / ' + escape(g.CARTAS[id].sub) + '</small>';
      card.appendChild(title);
    }
    const footer = document.createElement('div'); footer.className = 'mg-finish';
    footer.textContent = v === null ? 'Normal' : g.nombreVer(id,v);
    card.appendChild(footer);
    return card.outerHTML;
  };
})();
