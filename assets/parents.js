/* Champion du Lycée Français : espace parents */
(function () {
  "use strict";
  var CLF = window.CLF;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  if (!CLF || !CLF.navigateurRecent()) { $("ancien").hidden = false; return; }

  var JOURS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
  var flash = function (id, txt) { var el = $(id); el.textContent = txt; clearTimeout(el._t); el._t = setTimeout(function () { el.textContent = ""; }, 3500); };

  /* ---------- Réglages ---------- */
  var p = CLF.lire(CLF.CLES.prenom, "") || "";
  $("r-prenom").value = p;
  $("r-prenom").addEventListener("change", function () {
    var v = this.value.trim().replace(/\s+/g, " ").slice(0, 20);
    if (v) v = v.charAt(0).toUpperCase() + v.slice(1);
    this.value = v;
    CLF.ecrire(CLF.CLES.prenom, v);
    flash("r-message", v ? "Prénom enregistré : " + v + "." : "Prénom effacé : les jeux diront « Champion ».");
  });
  var reg = CLF.reglages();
  $("r-seance").value = String(reg.seance);
  $("r-seance").addEventListener("change", function () {
    var r = CLF.lire(CLF.CLES.reglages, {}) || {}; r.seance = +this.value;
    CLF.ecrire(CLF.CLES.reglages, r);
    flash("r-message", r.seance ? "Rappel réglé sur " + r.seance + " minutes." : "Rappel de fin de séance désactivé.");
  });

  /* ---------- Progrès ---------- */
  function progres() {
    var b = CLF.bilan(), act = CLF.activite(), j0 = CLF.aujourdhui();
    var jours = [], tot = 0;
    for (var i = 6; i >= 0; i--) { var d = CLF.ajouterJours(j0, -i); var m = act[d] ? act[d].total : 0; jours.push([d, m]); tot += m; }
    $("kpis").innerHTML =
      '<div><b>' + CLF.serie() + '</b><small>jours de suite</small></div>' +
      '<div><b>' + tot + '</b><small>minutes sur 7 jours</small></div>' +
      '<div><b>' + b.faites + '</b><small>missions réussies</small></div>';
    var max = Math.max(20, Math.max.apply(null, jours.map(function (x) { return x[1]; })));
    $("barres").innerHTML = jours.map(function (x) {
      var pa = x[0].split("-").map(Number), dj = new Date(pa[0], pa[1] - 1, pa[2]);
      return '<div><em>' + (x[1] || "") + '</em><i style="height:' + Math.round(x[1] / max * 120) + 'px"></i><small>' + JOURS[dj.getDay()] + ' ' + dj.getDate() + '</small></div>';
    }).join("");
    $("barres").setAttribute("aria-label", "Minutes de révision par jour : " + jours.map(function (x) { return x[1] + " min le " + x[0]; }).join(", "));
    var vus = CLF.derniereFois();
    $("tab-modules").innerHTML = CLF.MODULES.map(function (m) {
      var pr = b.parModule[m.id], pct = Math.round(Math.min(pr.faites, pr.total) / pr.total * 100);
      var v = vus[m.id] ? new Date(vus[m.id]) : null;
      return '<tr><td><a href="' + m.chemin + '">' + esc(m.titre) + '</a></td><td>' + esc(m.niveau) + '</td>' +
        '<td><div class="mini-barre"><i style="width:' + pct + '%"></i></div></td><td class="nb">' + pr.faites + ' / ' + pr.total + '</td>' +
        '<td>' + (pr.epreuve ? '<span class="etat ok">' + esc(pr.epreuve) + '</span>' : '<span class="etat">Pas encore</span>') + '</td>' +
        '<td>' + (v ? v.getDate() + "/" + String(v.getMonth() + 1).padStart(2, "0") : "–") + '</td></tr>';
    }).join("");
  }
  progres();

  /* ---------- Hors ligne ---------- */
  try {
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      CLF.enregistrerHorsLigne();
      navigator.serviceWorker.ready.then(function () { $("etat-horsligne").textContent = "Mode hors ligne actif sur cet appareil."; });
    }
  } catch (e) {}

  /* ---------- Sauvegarde ---------- */
  $("b-exporter").addEventListener("click", function () {
    var data = { site: "champion-du-lycee-francais", version: 1, date: new Date().toISOString(), donnees: {} };
    CLF.clesSauvegarde().forEach(function (k) { try { var v = localStorage.getItem(k); if (v !== null) data.donnees[k] = v; } catch (e) {} });
    var nom = "sauvegarde-champion-" + (CLF.prenomDefini() ? CLF.prenom().toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" : "") + CLF.aujourdhui() + ".json";
    try {
      var url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
      var a = document.createElement("a"); a.href = url; a.download = nom; document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
      flash("s-message", "Sauvegarde téléchargée : " + nom);
    } catch (e) { flash("s-message", "Le téléchargement n'a pas démarré. Essayez avec un autre navigateur."); }
  });
  $("f-importer").addEventListener("change", function () {
    var f = this.files && this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (!data || data.site !== "champion-du-lycee-francais" || !data.donnees) throw new Error("format");
        var autorisees = CLF.clesSauvegarde(), n = 0;
        Object.keys(data.donnees).forEach(function (k) { if (autorisees.indexOf(k) >= 0) { localStorage.setItem(k, data.donnees[k]); n++; } });
        $("r-prenom").value = CLF.lire(CLF.CLES.prenom, "") || "";
        progres();
        flash("s-message", "Sauvegarde ouverte : " + n + " éléments restaurés.");
      } catch (e) { flash("s-message", "Ce fichier n'est pas une sauvegarde du site. Choisissez le fichier « sauvegarde-champion-… .json »."); }
    };
    r.readAsText(f);
    this.value = "";
  });

  /* ---------- Effacer ---------- */
  $("b-effacer").addEventListener("click", function () {
    var z = $("zone-effacer");
    z.innerHTML = '<p>Tout sera effacé sur cet appareil. Pensez à télécharger une sauvegarde avant.</p><div class="rangee" style="margin-top:10px"><button class="btn discret" type="button" id="e-non">Annuler</button><button class="btn danger" type="button" id="e-oui">Effacer</button></div>';
    $("e-non").onclick = function () { location.reload(); };
    $("e-oui").onclick = function () {
      CLF.clesSauvegarde().forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
      try { localStorage.removeItem("clf-filtres"); } catch (e) {}
      location.href = "./";
    };
  });
})();
