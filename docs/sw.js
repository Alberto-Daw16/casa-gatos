/* Gremory · service worker: los avisos y la copia en el móvil de las ilustraciones del TCG. La app no se cachea:
   siempre se carga fresca de GitHub Pages (el sello de versión sigue mandando). */
self.addEventListener("install", function(){ self.skipWaiting(); });
/* 25/10/2026: las ilustraciones del TCG (las /img/ del Worker) se guardan en el móvil la primera vez que llegan.
   Así se siguen viendo cuando el Worker no contesta (los bloqueos del fútbol a Cloudflare) o sin conexión.
   Solo se guarda lo que llega bien (se piden en modo cors para saber el estado); la app sigue sin cachearse. */
var IMG_CACHE = "gremory-img-1";
self.addEventListener("fetch", function(e){
  var r = e.request; if(r.method !== "GET") return;
  var u; try { u = new URL(r.url); } catch(x){ return; }
  if(u.origin === self.location.origin || u.pathname.indexOf("/img/") !== 0) return;
  e.respondWith(caches.open(IMG_CACHE).then(function(c){
    return c.match(r.url).then(function(hit){
      if(hit) return hit;
      return fetch(new Request(r.url, {mode: "cors", credentials: "omit"})).then(function(res){
        if(res && res.ok) c.put(r.url, res.clone());
        return res;
      });
    });
  }).catch(function(){ return fetch(r); }));
});
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
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
    /* los avisos de eBay traen el anuncio: se abre directamente */
    var u = e.notification.data && e.notification.data.url;
    if(u && /^https?:/.test(u)) return self.clients.openWindow(u);
    for(var i=0;i<cs.length;i++){ if("focus" in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow("./");
  }));
});
