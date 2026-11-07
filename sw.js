/* Champion du Lycée Français : mode hors ligne
   - pages HTML : réseau d'abord (les mises à jour arrivent), copie locale si pas de réseau ;
   - autres fichiers et polices : copie locale d'abord, mise à jour en arrière-plan.
   Changer VERSION force le renouvellement de toutes les copies. */
var VERSION = "clf-v1";
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
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
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

  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") >= 0) {
    e.respondWith(fetch(req).then(function (rep) {
      var copie = rep.clone();
      caches.open(VERSION).then(function (c) { c.put(req, copie); });
      return rep;
    }).catch(function () {
      return caches.match(req).then(function (r) { return r || caches.match(req.url.replace(/[?#].*$/, "") + "index.html") || caches.match("./"); });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(function (local) {
    var reseau = fetch(req).then(function (rep) {
      if (rep && (rep.ok || rep.type === "opaque")) {
        var copie = rep.clone();
        caches.open(VERSION).then(function (c) { c.put(req, copie); });
      }
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
      return c.match(u).then(function (deja) { return deja || c.add(u).catch(function () {}); });
    }));
  }));
});
