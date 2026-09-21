/* Gremory · service worker: solo para los avisos. No cachea nada, así la app
   siempre se carga fresca de GitHub Pages (el sello de versión sigue mandando). */
self.addEventListener("install", function(){ self.skipWaiting(); });
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
    for(var i=0;i<cs.length;i++){ if("focus" in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow("./");
  }));
});
