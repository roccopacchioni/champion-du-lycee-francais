/* Champion du Lycée Français : mode hors ligne
   - pages, scripts, styles et images du site : réseau d'abord (les mises à jour arrivent
     tout de suite), copie locale seulement sans connexion ;
   - polices Google : copie locale d'abord.
   Changer VERSION force le renouvellement de toutes les copies. */
var VERSION = "clf-v4";
var BASE = [
  "./",
  "index.html",
  "parents.html",
  "modules.html",
  "manifest.webmanifest",
  "favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "assets/site.css",
  "assets/commun.js",
  "assets/catalogue.js",
  "assets/accueil.js",
  "assets/parents.js",
  "assets/tous.js",
  "assets/module-bridge.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(BASE.map(function (u) { return new Request(u, { cache: "reload" }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var memeSite = url.origin === self.location.origin;
  var police = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!memeSite && !police) return;

  if (memeSite) {
    /* réseau d'abord, sans passer par le cache HTTP du navigateur */
    e.respondWith(fetch(req, { cache: "no-cache" }).then(function (rep) {
      if (rep && rep.ok) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(req, copie); }); }
      return rep;
    }).catch(function () {
      return caches.match(req).then(function (r) {
        if (r) return r;
        if (req.mode === "navigate") return caches.match(req.url.replace(/[?#].*$/, "") + "index.html").then(function (r2) { return r2 || caches.match("./"); });
        return Response.error();
      });
    }));
    return;
  }

  /* polices : copie locale d'abord */
  e.respondWith(caches.match(req).then(function (local) {
    var reseau = fetch(req).then(function (rep) {
      if (rep && (rep.ok || rep.type === "opaque")) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(req, copie); }); }
      return rep;
    }).catch(function () { return local; });
    return local || reseau;
  }));
});

/* L'accueil demande de préparer tous les modules pour le hors ligne */
self.addEventListener("message", function (e) {
  if (!e.data || e.data.type !== "precharger" || !Array.isArray(e.data.urls)) return;
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return Promise.all(e.data.urls.map(function (u) {
      return c.match(u).then(function (deja) { return deja || c.add(new Request(u, { cache: "reload" })).catch(function () {}); });
    }));
  }));
});
