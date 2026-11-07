/* Champion du Lycée Français : page d'accueil */
(function () {
  "use strict";
  var CLF = window.CLF;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  if (!CLF || !CLF.navigateurRecent()) { var a = $("ancien"); if (a) a.hidden = false; return; }

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  var DOM = {}; CLF.DOMAINES.forEach(function (d) { DOM[d.id] = d; });

  var ICONES = {
    francais: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 26 L14 6 h4 l8 20 h-4.6 l-1.8-4.8 h-7.2 L10.6 26 Z M13.8 17.4 h4.4 L16 11.2 Z" fill="currentColor"/></svg>',
    maths: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 8 l16 16 M24 8 L8 24" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
    qlm: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4 h14 v3 c0 5-5 7-5 9 s5 4 5 9 v3 H9 v-3 c0-5 5-7 5-9 s-5-4-5-9 Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M12 25 c1-3 3-4 4-4 s3 1 4 4 Z" fill="currentColor"/></svg>',
    defaut: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4 l3.6 7.6 8.2 1 -6 5.7 1.6 8.1 -7.4-4 -7.4 4 1.6-8.1 -6-5.7 8.2-1z" fill="currentColor"/></svg>'
  };
  var FLECHE = '<svg class="fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ETOILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z" fill="var(--or)"/></svg>';

  function medailleSvg(type) {
    var c = type === "or" ? "var(--or)" : type === "argent" ? "var(--argent)" : type === "bronze" ? "var(--bronze)" : null;
    if (!c) return '<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M17 3h8l4 14h-8z M35 3h-8l-4 14h8z" fill="var(--vide)"/><circle cx="26" cy="33" r="15" fill="none" stroke="var(--vide)" stroke-width="3" stroke-dasharray="5 4"/></svg>';
    return '<svg viewBox="0 0 52 52" aria-hidden="true"><path d="M15 3h9l5 15h-9z" fill="#2453BE"/><path d="M37 3h-9l-5 15h9z" fill="#C0402C"/>' +
      '<circle cx="26" cy="33" r="16" fill="' + c + '"/><circle cx="26" cy="33" r="11.5" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>' +
      '<path d="M26 25.5l2.2 4.6 5 .6-3.7 3.5 1 5-4.5-2.5-4.5 2.5 1-5-3.7-3.5 5-.6z" fill="rgba(255,255,255,.9)"/></svg>';
  }

  function joursAvant(m) { return m.echeance ? CLF.joursEntre(CLF.aujourdhui(), m.echeance) : null; }
  function depuis(ts) {
    if (!ts) return null;
    var j = CLF.joursEntre(CLF.iso(new Date(ts)), CLF.aujourdhui());
    return j <= 0 ? "aujourd'hui" : j === 1 ? "hier" : "il y a " + j + " jours";
  }

  /* ---------- Mission du jour : une seule proposition, pour éviter de devoir choisir ---------- */
  function missionDuJour(bilan) {
    var vus = CLF.derniereFois();
    var ouverts = CLF.actifs().filter(function (m) { var p = bilan.parModule[m.id]; return p.faites < p.total; });
    var urgents = ouverts.filter(function (m) { var d = joursAvant(m); return d !== null && d >= 0 && d <= 14; })
      .sort(function (a, b) { return joursAvant(a) - joursAvant(b); });
    var m, pourquoi;
    if (urgents.length) {
      m = urgents[0]; var d = joursAvant(m);
      pourquoi = (d === 0 ? "C'est aujourd'hui : " : d === 1 ? "C'est demain : " : "Encore " + d + " jours avant : ") + m.echeanceLabel.charAt(0).toLowerCase() + m.echeanceLabel.slice(1) + ".";
    } else if (ouverts.length) {
      ouverts.sort(function (a, b) { return (vus[a.id] || 0) - (vus[b.id] || 0); });
      m = ouverts[0]; var p = bilan.parModule[m.id];
      pourquoi = vus[m.id] ? "Tu y as joué " + depuis(vus[m.id]) + ". Prochaine mission : " + (p.faites + 1) + " sur " + p.total + "." : "Un nouveau cahier t'attend.";
    } else if (CLF.actifs().length) {
      m = CLF.actifs().slice().sort(function (a, b) { return (vus[a.id] || 0) - (vus[b.id] || 0); })[0];
      pourquoi = "Tout est réussi ici. Rejoue l'épreuve finale pour garder la forme : " + m.epreuve.charAt(0).toLowerCase() + m.epreuve.slice(1) + ".";
    }
    return m ? { m: m, pourquoi: pourquoi } : null;
  }

  function rendreCahier(b) {
    var d = new Date();
    $("date").textContent = JOURS[d.getDay()].charAt(0).toUpperCase() + JOURS[d.getDay()].slice(1) + " " + d.getDate() + " " + MOIS[d.getMonth()];
    $("bonjour").textContent = "Bonjour " + CLF.prenom() + " !";
    var serie = CLF.serie();
    var pct = b.suivant ? Math.round((b.faites - b.rang.seuil) / (b.suivant.seuil - b.rang.seuil) * 100) : 100;
    $("rang").innerHTML =
      '<span class="rang-nom">' + ETOILE + esc(b.rang.nom) + '</span>' +
      '<div class="jauge"><div class="jauge-barre" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progression vers le rang suivant"><i style="width:' + pct + '%"></i></div>' +
      '<small>' + b.faites + ' mission' + (b.faites > 1 ? 's' : '') + ' réussie' + (b.faites > 1 ? 's' : '') + (b.suivant ? ' · rang « ' + esc(b.suivant.nom) + ' » à ' + b.suivant.seuil : ' · rang maximum atteint') + '</small></div>' +
      (serie > 1 ? '<span class="serie"><b>' + serie + ' jours</b> d\'entraînement de suite</span>' : '');

    var md = missionDuJour(b), box = $("mission-jour");
    if (!md) { box.innerHTML = '<p class="pourquoi">Aucun module pour l\'instant.</p>'; return; }
    var p = b.parModule[md.m.id];
    box.innerHTML = '<p class="pourquoi">' + esc(md.pourquoi) + '</p>' +
      '<a class="btn-jouer" href="' + md.m.chemin + '"><span class="pastille">' + (ICONES[md.m.domaine] || ICONES.defaut) + '</span>' +
      '<span><b>Jouer : ' + esc(md.m.titre) + '</b><span>' + esc(DOM[md.m.domaine] ? DOM[md.m.domaine].nom : "") + ' · ' + esc(md.m.niveau) + ' · ' + p.faites + ' sur ' + p.total + ' missions</span></span>' + FLECHE + '</a>';
  }

  function rendreVitrine(b) {
    $("vitrine").innerHTML = CLF.actifs().map(function (m) {
      var p = b.parModule[m.id], med = CLF.medaille(p);
      var lib = med === "or" ? "Médaille d'or" : med === "argent" ? "Médaille d'argent" : med === "bronze" ? "Médaille de bronze" : "À gagner";
      return '<a class="trophee" href="' + m.chemin + '">' + medailleSvg(med) + '<span><b>' + esc(m.titre) + '</b><small>' + lib + '</small></span></a>';
    }).join("");
  }

  /* ---------- Filtres et cahiers ---------- */
  var filtre = { niveau: "tous", domaine: "tous" };
  try { var f = JSON.parse(localStorage.getItem("clf-filtres") || "null"); if (f) filtre = f; } catch (e) {}
  function garderFiltre() { try { localStorage.setItem("clf-filtres", JSON.stringify(filtre)); } catch (e) {} }

  function puces(id, valeurs, cle) {
    $(id).innerHTML = valeurs.map(function (v) {
      var on = filtre[cle] === v.id;
      return '<button type="button" class="puce" data-cle="' + cle + '" data-val="' + v.id + '" aria-pressed="' + on + '"' + (v.n === 0 ? " disabled" : "") + '>' + esc(v.nom) + '</button>';
    }).join("");
  }

  function statut(m, p) {
    var out = [], d = joursAvant(m);
    if (p.faites >= p.total) out.push('<span>Cahier terminé</span>');
    if (d !== null && d >= 0) out.push('<span class="' + (d <= 3 ? "chaud" : "") + '">' + (d === 0 ? "C'est aujourd'hui" : "J-" + d) + '</span>');
    else if (d !== null) out.push('<span>Évaluation passée : révision</span>');
    else out.push('<span>Entraînement libre</span>');
    var v = CLF.derniereFois()[m.id];
    if (v) out.push('<small>Joué ' + depuis(v) + '</small>');
    return out.join("");
  }

  function carte(m, b) {
    var p = b.parModule[m.id], dom = DOM[m.domaine] || { nom: "", couleur: "em" };
    var pct = Math.round(Math.min(p.faites, p.total) / p.total * 100);
    return '<a class="couv ' + dom.couleur + '" href="' + m.chemin + '">' +
      '<div class="etiquette"><div class="ligne1"><span>' + esc(m.sousDomaine) + '</span><span class="niveau">' + esc(m.niveau) + '</span></div>' +
      '<h4>' + esc(m.titre) + '</h4><p>' + esc(m.accroche) + '</p></div>' +
      '<div class="pied"><div class="avance"><div class="barre"><i style="width:' + pct + '%"></i></div><b>' + p.faites + ' / ' + p.total + ' missions</b></div>' +
      '<div class="statut">' + statut(m, p) + '</div></div></a>';
  }

  function rendreModules(b) {
    var ACT = CLF.actifs();
    var niv = [{ id: "tous", nom: "Toutes les classes", n: ACT.length }].concat(CLF.NIVEAUX.map(function (n) {
      return { id: n, nom: n, n: ACT.filter(function (m) { return m.niveau === n; }).length };
    }));
    var doms = [{ id: "tous", nom: "Toutes les matières", n: ACT.length }].concat(CLF.DOMAINES.map(function (d) {
      return { id: d.id, nom: d.nom, n: ACT.filter(function (m) { return m.domaine === d.id; }).length };
    }).filter(function (d) { return d.n > 0; }));
    if (!niv.some(function (v) { return v.id === filtre.niveau && v.n; })) filtre.niveau = "tous";
    if (!doms.some(function (v) { return v.id === filtre.domaine && v.n; })) filtre.domaine = "tous";
    puces("filtre-niveau", niv, "niveau");
    puces("filtre-domaine", doms, "domaine");

    var visibles = ACT.filter(function (m) {
      return (filtre.niveau === "tous" || m.niveau === filtre.niveau) && (filtre.domaine === "tous" || m.domaine === filtre.domaine);
    });
    $("compte-modules").textContent = visibles.length + " cahier" + (visibles.length > 1 ? "s" : "") + " · classés par matière, comme à l'école";
    var html = CLF.DOMAINES.map(function (d) {
      var ms = visibles.filter(function (m) { return m.domaine === d.id; });
      if (!ms.length) return "";
      ms.sort(function (a, b2) { return CLF.NIVEAUX.indexOf(a.niveau) - CLF.NIVEAUX.indexOf(b2.niveau) || (b2.creation > a.creation ? 1 : -1); });
      return '<div class="domaine"><h3><i style="--c:var(--' + d.couleur + ')"></i>' + esc(d.nom) + '</h3><div class="grille">' + ms.map(function (m) { return carte(m, b); }).join("") + '</div></div>';
    }).join("");
    $("liste-modules").innerHTML = html || '<p class="vide">Aucun cahier pour ce choix. Touche « Toutes les classes ».</p>';
    var nArch = CLF.MODULES.length - ACT.length;
    $("lien-tous").innerHTML = '<a class="btn discret" href="modules.html">Voir tous les modules (' + CLF.MODULES.length + ')</a>' +
      (nArch ? '<span>dont ' + nArch + ' archive' + (nArch > 1 ? 's' : '') + ' des premiers jeux</span>' : '');
  }

  document.addEventListener("click", function (e) {
    var p = e.target.closest(".puce");
    if (!p || p.disabled) return;
    filtre[p.getAttribute("data-cle")] = p.getAttribute("data-val");
    garderFiltre(); rendreModules(CLF.bilan());
  });

  /* ---------- Espace parents : appui long (2 s) pour éviter les ouvertures par erreur ---------- */
  (function () {
    var b = $("btn-parents"), t = 0, ok = false;
    var aide = function (txt) { $("aide-parents").textContent = txt; };
    b.addEventListener("pointerdown", function () {
      ok = false; b.classList.add("appui");
      t = setTimeout(function () { ok = true; b.classList.remove("appui"); location.href = b.getAttribute("href"); }, 1400);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
      b.addEventListener(ev, function () { clearTimeout(t); b.classList.remove("appui"); });
    });
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    b.addEventListener("click", function (e) {
      if (e.detail === 0 || ok) return; /* clavier : accès direct */
      e.preventDefault(); aide("Garde le doigt appuyé 2 secondes pour ouvrir l'espace parents.");
    });
  })();

  /* ---------- Prénom au premier passage ---------- */
  function demanderPrenom() {
    var v = $("voile-prenom"), champ = $("champ-prenom");
    v.hidden = false; champ.value = ""; setTimeout(function () { champ.focus(); }, 50);
    $("form-prenom").onsubmit = function (e) {
      e.preventDefault();
      var p = champ.value.trim().replace(/\s+/g, " ").slice(0, 20);
      if (p) { p = p.charAt(0).toUpperCase() + p.slice(1); CLF.ecrire(CLF.CLES.prenom, p); }
      v.hidden = true; tout();
    };
    $("prenom-plus-tard").onclick = function () { CLF.ecrire(CLF.CLES.prenom, ""); v.hidden = true; try { sessionStorage.setItem("clf-prenom-plus-tard", "1"); } catch (e) {} };
  }

  function tout() {
    var b = CLF.bilan();
    rendreCahier(b); rendreVitrine(b); rendreModules(b);
  }
  tout();
  var vuPlusTard = false; try { vuPlusTard = sessionStorage.getItem("clf-prenom-plus-tard") === "1"; } catch (e) {}
  if (!CLF.prenomDefini() && !vuPlusTard && CLF.lire(CLF.CLES.prenom, null) === null) demanderPrenom();

  /* Retour sur la page (bouton précédent) : rafraîchir les progrès */
  window.addEventListener("pageshow", function (e) { if (e.persisted) tout(); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tout(); });

  /* ---------- Hors ligne : préparer tous les modules ---------- */
  CLF.enregistrerHorsLigne();
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(function (reg) {
        var urls = [];
        CLF.MODULES.forEach(function (m) { urls.push(m.chemin, m.chemin + "index.html"); urls = urls.concat(m.fichiers || []); });
        if (reg.active) reg.active.postMessage({ type: "precharger", urls: urls });
      }).catch(function () {});
    }
  } catch (e) {}
})();
