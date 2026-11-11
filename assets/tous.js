/* Champion du Lycée Français : page « Tous les modules » */
(function () {
  "use strict";
  var CLF = window.CLF;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  if (!CLF || !CLF.navigateurRecent()) { $("ancien").hidden = false; return; }

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var CYCLE = { CP: "cycle 2", CE1: "cycle 2", CE2: "cycle 2", CM1: "cycle 3", CM2: "cycle 3", "6e": "cycle 3" };
  var DOM = {}; CLF.DOMAINES.forEach(function (d) { DOM[d.id] = d; });
  var moisAn = function (iso) { var p = iso.split("-"); return MOIS[+p[1] - 1] + " " + p[0]; };

  function rendre() {
    var b = CLF.bilan(), ms = CLF.MODULES;
    var niveaux = CLF.NIVEAUX.filter(function (n) { return ms.some(function (m) { return m.niveau === n; }); });
    var doms = {}; ms.forEach(function (m) { doms[m.domaine] = 1; });
    var nArch = ms.filter(function (m) { return m.archive; }).length;
    $("resume").innerHTML = '<span>' + ms.length + ' modules</span><span>' + niveaux.length + ' classe' + (niveaux.length > 1 ? 's' : '') + '</span>' +
      '<span>' + Object.keys(doms).length + ' matières</span>' + (nArch ? '<span>' + nArch + ' archives</span>' : '');

    $("liste").innerHTML = niveaux.slice().reverse().map(function (n) {
      var liste = ms.filter(function (m) { return m.niveau === n; }).sort(function (a, c) {
        return a.creation < c.creation ? 1 : a.creation > c.creation ? -1 : 0;
      });
      return '<section class="classe"><h2>' + n + ' <small>' + CYCLE[n] + ' · ' + liste.length + ' module' + (liste.length > 1 ? 's' : '') + '</small></h2>' +
        liste.map(function (m) {
          var d = DOM[m.domaine] || { nom: "", couleur: "em" }, p = b.parModule[m.id];
          var etat = m.archive ? '<span class="pastille-archive">Archive</span>'
            : '<span class="etat-module">' + p.faites + ' / ' + p.total + ' missions' + (p.epreuve ? '<br>Épreuve : ' + esc(p.epreuve) : '') + '</span>';
          return '<article class="fiche ' + d.couleur + '"><div class="dos"></div><div class="corps">' +
            '<div class="meta"><b>' + esc(d.nom) + '</b><span>' + esc(m.sousDomaine) + '</span><span>créé en ' + moisAn(m.creation) + '</span></div>' +
            '<h3>' + esc(m.titre) + '</h3><p>' + esc(m.accroche) + '</p>' +
            '<ul>' + m.competences.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul>' +
            '<div class="meta"><span>' + esc(m.echeanceLabel) + '</span></div></div>' +
            '<div class="actions">' + etat + '<a class="btn" href="' + m.chemin + '">Ouvrir</a></div></article>';
        }).join("") + '</section>';
    }).join("");
  }
  rendre();
  document.addEventListener("visibilitychange", function () { if (!document.hidden) rendre(); });
  CLF.enregistrerHorsLigne();
})();
