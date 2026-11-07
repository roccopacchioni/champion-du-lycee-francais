/* =====================================================================
   Champion du Lycée Français : fonctions partagées
   (accueil, espace parents et pont des modules)
   Toutes les données restent dans le navigateur de l'appareil.
   ===================================================================== */
(function () {
  "use strict";
  var CLF = window.CLF = window.CLF || {};

  var K = CLF.CLES = {
    prenom: "clf-prenom",
    reglages: "clf-reglages",
    activite: "clf-activite",
    dernier: "clf-dernier"
  };

  function lire(cle, defaut) {
    try { var r = localStorage.getItem(cle); return r === null ? defaut : JSON.parse(r); } catch (e) { return defaut; }
  }
  function ecrire(cle, val) {
    try { localStorage.setItem(cle, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  CLF.lire = lire;
  CLF.ecrire = ecrire;

  CLF.prenom = function () {
    var p = lire(K.prenom, "");
    return (p && String(p).trim()) || "Champion";
  };
  CLF.prenomDefini = function () { return !!String(lire(K.prenom, "") || "").trim(); };

  CLF.reglages = function () {
    var r = lire(K.reglages, {}) || {};
    return { seance: typeof r.seance === "number" ? r.seance : 20 };
  };

  /* Dates au format AAAA-MM-JJ, en heure locale */
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  CLF.iso = iso;
  CLF.aujourdhui = function () { return iso(new Date()); };
  CLF.joursEntre = function (a, b) {
    var pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    return Math.round((new Date(pb[0], pb[1] - 1, pb[2]) - new Date(pa[0], pa[1] - 1, pa[2])) / 864e5);
  };
  CLF.ajouterJours = function (s, n) {
    var p = s.split("-").map(Number); return iso(new Date(p[0], p[1] - 1, p[2] + n));
  };

  /* Activité : minutes jouées par jour et par module */
  CLF.activite = function () { return lire(K.activite, {}) || {}; };
  CLF.noterMinute = function (moduleId) {
    var a = CLF.activite(), j = CLF.aujourdhui();
    var jour = a[j] || (a[j] = { total: 0, modules: {} });
    jour.total += 1;
    jour.modules[moduleId] = (jour.modules[moduleId] || 0) + 1;
    var cles = Object.keys(a).sort();
    while (cles.length > 90) delete a[cles.shift()];
    ecrire(K.activite, a);
  };
  CLF.serie = function () {
    var a = CLF.activite(), j = CLF.aujourdhui(), n = 0;
    if (!a[j]) j = CLF.ajouterJours(j, -1);
    while (a[j] && a[j].total > 0) { n++; j = CLF.ajouterJours(j, -1); }
    return n;
  };
  CLF.derniereFois = function () { return lire(K.dernier, {}) || {}; };
  CLF.noterVisite = function (moduleId) {
    var d = CLF.derniereFois(); d[moduleId] = Date.now(); ecrire(K.dernier, d);
  };

  /* Rangs du site : ils montent avec le nombre total de missions réussies */
  CLF.RANGS = [
    { seuil: 0, nom: "Recrue" },
    { seuil: 3, nom: "Espoir" },
    { seuil: 8, nom: "Titulaire" },
    { seuil: 15, nom: "Capitaine" },
    { seuil: 25, nom: "Champion" },
    { seuil: 40, nom: "Champion du Lycée Français" }
  ];
  CLF.bilan = function () {
    var total = 0, faites = 0, etoiles = 0, parModule = {};
    (CLF.MODULES || []).forEach(function (m) {
      if (m.archive) { parModule[m.id] = { faites: 0, total: 0, etoiles: 0, etoilesMax: 0, epreuve: null, archive: true }; return; }
      var p = { faites: 0, total: m.missions, etoiles: 0, etoilesMax: m.missions * 3, epreuve: null };
      try { p = m.progression(); } catch (e) {}
      parModule[m.id] = p;
      total += p.total; faites += Math.min(p.faites, p.total); etoiles += p.etoiles;
    });
    var r = 0;
    CLF.RANGS.forEach(function (x, i) { if (faites >= x.seuil) r = i; });
    var suivant = CLF.RANGS[r + 1] || null;
    return { total: total, faites: faites, etoiles: etoiles, parModule: parModule, rang: CLF.RANGS[r], rangIndex: r, suivant: suivant };
  };

  /* Médaille d'un module selon sa progression */
  CLF.medaille = function (p) {
    if (!p || !p.total || p.archive) return null;
    var x = p.faites / p.total;
    if (x >= 1) return "or";
    if (x >= 0.67) return "argent";
    if (x >= 0.34) return "bronze";
    return null;
  };

  /* Clés de stockage à sauvegarder / restaurer */
  CLF.clesSauvegarde = function () {
    var c = [K.prenom, K.reglages, K.activite, K.dernier];
    (CLF.MODULES || []).forEach(function (m) { if (m.cleProgression) c.push(m.cleProgression); });
    return c;
  };

  /* Navigateur trop ancien (Internet Explorer) : message clair */
  CLF.actifs = function () { return (CLF.MODULES || []).filter(function (m) { return !m.archive; }); };
  CLF.navigateurRecent = function () {
    try { return !!(window.Promise && window.fetch && window.CSS && CSS.supports && CSS.supports("display", "grid")); } catch (e) { return false; }
  };

  /* Mode hors ligne : service worker à la racine du site */
  CLF.racine = function () {
    var s = document.querySelector('script[src$="commun.js"]');
    if (!s) return "./";
    return s.getAttribute("src").replace(/assets\/commun\.js$/, "") || "./";
  };
  CLF.enregistrerHorsLigne = function () {
    try {
      if (!("serviceWorker" in navigator)) return;
      if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
      var r = CLF.racine();
      navigator.serviceWorker.register(r + "sw.js", { scope: r }).catch(function () {});
    } catch (e) {}
  };
})();
