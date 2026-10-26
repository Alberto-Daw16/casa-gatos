/* Gremory · service worker: los avisos y la copia en el móvil de las ilustraciones del TCG. La app no se cachea:
   siempre se carga fresca de GitHub Pages (el sello de versión sigue mandando). */
self.addEventListener("install", function(){ self.skipWaiting(); });
/* 25/10/2026: las ilustraciones del TCG (las /img/ del Worker) no dependen de Cloudflare, que los fines de semana
   bloquean por el fútbol. Orden: 1) la copia guardada en el móvil; 2) la copia CIFRADA que hay en la propia web
   (tcg/c/, GitHub Pages): solo se descifra con la clave de sincronización (va en la propia petición, ?k=), así en el
   repo público no se ve nada; 3) el Worker, como siempre (lo nuevo que aún no esté cifrado).
   Lo que llega bien se guarda en el móvil. La app en sí no se cachea. */
var IMG_CACHE = "gremory-img-1", CIF = "tcg/c/", TE = new TextEncoder(), CLAVES = {};
function hexSha(s){ return crypto.subtle.digest("SHA-256", TE.encode(s)).then(function(h){ return Array.prototype.map.call(new Uint8Array(h), function(b){ return ("0" + b.toString(16)).slice(-2); }).join(""); }); }
function claveDe(k){ return CLAVES[k] || (CLAVES[k] = crypto.subtle.digest("SHA-256", TE.encode("gremory-img-v1|" + k)).then(function(raw){ return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]); })); }
function tipoDe(n){ return /\.json$/i.test(n) ? "application/json" : /\.png$/i.test(n) ? "image/png" : /\.jpe?g$/i.test(n) ? "image/jpeg" : "image/webp"; }
function cifrada(nombre, k){
  return hexSha("gremory-img-nombre|" + k + "|" + nombre).then(function(h){ return fetch(CIF + h.slice(0, 32) + ".bin"); }).then(function(r){
    if(!r.ok) throw new Error("no cifrada");
    return Promise.all([r.arrayBuffer(), claveDe(k)]);
  }).then(function(x){ var b = new Uint8Array(x[0]);
    return crypto.subtle.decrypt({name: "AES-GCM", iv: b.slice(0, 12)}, x[1], b.slice(12));
  }).then(function(plano){ return new Response(plano, {status: 200, headers: {"content-type": tipoDe(nombre), "access-control-allow-origin": "*"}}); });
}
self.addEventListener("fetch", function(e){
  var r = e.request; if(r.method !== "GET") return;
  var u; try { u = new URL(r.url); } catch(x){ return; }
  if(u.origin === self.location.origin || u.pathname.indexOf("/img/") !== 0) return;
  var nombre = decodeURIComponent(u.pathname.slice(5)), k = u.searchParams.get("k") || "";
  e.respondWith(caches.open(IMG_CACHE).then(function(c){
    return c.match(r.url).then(function(hit){
      if(hit) return hit;
      var guarda = function(res){ if(res && res.ok) c.put(r.url, res.clone()); return res; };
      var worker = function(){ return fetch(new Request(r.url, {mode: "cors", credentials: "omit"})).then(guarda); };
      return (k ? cifrada(nombre, k).then(guarda, worker) : worker());
    });
  }).catch(function(){ return fetch(r); }));
});
self.addEventListener("push", function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(x){ d = {cuerpo: e.data ? e.data.text() : ""}; }
  e.waitUntil(self.registration.showNotification(d.titulo || "Gremory", {
    body: d.cuerpo || "",
    tag: d.tag || undefined,
    icon: "g-180.png",
    badge: "g-180.png",
    data: {url: d.url || "./"}
  }));
});
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window", includeUncontrolled:true}).then(function(cs){
    var u = e.notification.data && e.notification.data.url;
    /* el aviso de los sobres del TCG: si la app ya está abierta, se le pide que abra los sobres; si no, se abre con #sobres */
    if(u && /#sobres$/.test(u)){
      for(var j=0;j<cs.length;j++){ if("focus" in cs[j]){ cs[j].postMessage({tcg:"sobres"}); return cs[j].focus(); } }
      return self.clients.openWindow(u);
    }
    if(u && /^https?:/.test(u)) return self.clients.openWindow(u);
    for(var i=0;i<cs.length;i++){ if("focus" in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow("./");
  }));
});
