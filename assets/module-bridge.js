/* =====================================================================
   Champion du Lycée Français : pont entre le site et chaque module
   À inclure dans le <head> de chaque module, après commun.js :
   <script src="../../assets/module-bridge.js" data-module="mon-module"></script>
   Rôle : prénom de l'enfant, bouton de retour, suivi du temps de jeu,
   rappel de fin de séance, mode hors ligne.
   ===================================================================== */
(function () {
  "use strict";
  var CLF = window.CLF || {};
  var script = document.currentScript;
  var MODULE = (script && script.getAttribute("data-module")) || "module";
  var RACINE = CLF.racine ? CLF.racine() : "../../";
  var PRENOM = CLF.prenom ? CLF.prenom() : "Champion";
  var ORIGINE = "Carlo"; /* prénom écrit dans les modules d'origine */

  /* 1. Prénom : remplace le prénom d'origine à l'écran et dans la voix */
  if (PRENOM !== ORIGINE) {
    var re = new RegExp("\\b" + ORIGINE + "\\b", "g");
    var rp = function () { return PRENOM; };
    var remplacer = function (noeud) {
      if (noeud.nodeType === 3) {
        if (noeud.data.indexOf(ORIGINE) >= 0) noeud.data = noeud.data.replace(re, rp);
        return;
      }
      if (noeud.nodeType !== 1 || noeud.nodeName === "SCRIPT" || noeud.nodeName === "STYLE") return;
      var w = document.createTreeWalker(noeud, NodeFilter.SHOW_TEXT, null);
      var t; while ((t = w.nextNode())) if (t.data.indexOf(ORIGINE) >= 0) t.data = t.data.replace(re, rp);
    };
    try {
      new MutationObserver(function (liste) {
        liste.forEach(function (m) {
          if (m.type === "characterData") remplacer(m.target);
          else m.addedNodes.forEach(remplacer);
        });
      }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    try {
      var U = window.SpeechSynthesisUtterance;
      if (U) {
        var Remplace = function (texte) { return new U(String(texte == null ? "" : texte).replace(re, rp)); };
        Remplace.prototype = U.prototype;
        window.SpeechSynthesisUtterance = Remplace;
      }
    } catch (e) {}
  }

  /* 2. Bouton « Mes modules » en haut de page */
  var css = ".clf-bar{display:flex;align-items:center;gap:10px;max-width:560px;margin:0 auto;box-sizing:border-box;" +
    "padding:8px max(16px,env(safe-area-inset-right,0px)) 2px max(16px,env(safe-area-inset-left,0px));font:600 14px/1.2 Andika,'Trebuchet MS',system-ui,sans-serif}" +
    ".clf-bar a{display:inline-flex;align-items:center;gap:6px;min-height:40px;padding:0 14px 0 10px;border-radius:999px;color:inherit;text-decoration:none;" +
    "border:2px solid color-mix(in srgb,currentColor 22%,transparent);background:color-mix(in srgb,currentColor 6%,transparent)}" +
    ".clf-bar a:focus-visible{outline:3px solid currentColor;outline-offset:2px}" +
    ".clf-bar svg{width:18px;height:18px;flex:none}" +
    ".clf-bar span.clf-nom{opacity:.7;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}" +
    ".clf-toast{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;" +
    "width:min(520px,calc(100% - 32px));box-sizing:border-box;background:#14306E;color:#fff;border-radius:18px;padding:14px 16px;" +
    "box-shadow:0 12px 30px rgba(0,0,0,.35);font:16px/1.4 Andika,'Trebuchet MS',system-ui,sans-serif;display:grid;gap:10px}" +
    ".clf-toast b{font-size:18px}.clf-toast .clf-row{display:flex;gap:8px;flex-wrap:wrap}" +
    ".clf-toast a,.clf-toast button{flex:1 1 140px;min-height:48px;border-radius:12px;border:0;font:700 16px Andika,'Trebuchet MS',sans-serif;cursor:pointer;" +
    "display:flex;align-items:center;justify-content:center;text-decoration:none;padding:0 12px}" +
    ".clf-toast a{background:#FFD25A;color:#14306E}.clf-toast button{background:rgba(255,255,255,.14);color:#fff}" +
    "@media (prefers-reduced-motion:no-preference){.clf-toast{animation:clfup .3s ease-out}}" +
    "@keyframes clfup{from{transform:translate(-50%,120%)}to{transform:translateX(-50%)}}";

  function barre() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var b = document.createElement("nav");
    b.className = "clf-bar"; b.setAttribute("aria-label", "Champion du Lycée Français");
    b.innerHTML = '<a href="' + RACINE + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Mes modules</a>' +
      '<span class="clf-nom">Champion du Lycée Français</span>';
    document.body.insertBefore(b, document.body.firstChild);
    /* si le jeu a déjà sa marge latérale sur <body>, ne pas la doubler */
    try {
      var cs = getComputedStyle(document.body);
      if (parseFloat(cs.paddingLeft) >= 12) { b.style.paddingLeft = "0"; b.style.paddingRight = "0"; }
    } catch (e) {}
  }

  /* 3. Temps de jeu : une minute comptée quand la page reste visible */
  var minutesSeance = 0;
  try { minutesSeance = +sessionStorage.getItem("clf-seance") || 0; } catch (e) {}
  var dejaPrevenu = false;
  try { dejaPrevenu = sessionStorage.getItem("clf-seance-prevenu") === "1"; } catch (e) {}

  function rappel() {
    if (dejaPrevenu || document.querySelector(".clf-toast")) return;
    dejaPrevenu = true;
    try { sessionStorage.setItem("clf-seance-prevenu", "1"); } catch (e) {}
    var t = document.createElement("div");
    t.className = "clf-toast"; t.setAttribute("role", "status");
    t.innerHTML = "<b>Belle séance, " + PRENOM.replace(/[<>&"]/g, "") + " !</b><span>Ton cerveau a bien travaillé. Termine ta mission, puis fais une vraie pause.</span>" +
      '<div class="clf-row"><a href="' + RACINE + '">J\'ai fini pour aujourd\'hui</a><button type="button">Je termine ma mission</button></div>';
    document.body.appendChild(t);
    t.querySelector("button").onclick = function () { t.remove(); };
  }
  function tic() {
    if (document.hidden) return;
    if (CLF.noterMinute) CLF.noterMinute(MODULE);
    minutesSeance++;
    try { sessionStorage.setItem("clf-seance", String(minutesSeance)); } catch (e) {}
    var lim = CLF.reglages ? CLF.reglages().seance : 20;
    if (lim > 0 && minutesSeance >= lim) rappel();
  }

  function demarrer() {
    barre();
    if (CLF.noterVisite) CLF.noterVisite(MODULE);
    setInterval(tic, 60000);
    if (CLF.enregistrerHorsLigne) CLF.enregistrerHorsLigne();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
