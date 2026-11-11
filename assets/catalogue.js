/* =====================================================================
   Champion du Lycée Français : catalogue des modules
   ---------------------------------------------------------------------
   Pour ajouter un module :
   1. créer le dossier modules/<identifiant>/ avec son index.html
      (respecter la charte : voir CHARTE-MODULES.md) ;
   2. ajouter une entrée ci-dessous, dans le tableau MODULES.
   Rien d'autre à modifier : l'accueil, la vitrine, l'espace parents
   et le mode hors ligne lisent ce fichier.
   ===================================================================== */
(function () {
  "use strict";

  /* Domaines d'enseignement, dans l'ordre des programmes officiels
     (cycle 2 : CP, CE1, CE2 ; cycle 3 : CM1, CM2, 6e). */
  var DOMAINES = [
    { id: "francais", nom: "Français", couleur: "fr" },
    { id: "maths", nom: "Mathématiques", couleur: "ma" },
    { id: "qlm", nom: "Questionner le monde", couleur: "qm" },
    { id: "histgeo", nom: "Histoire et géographie", couleur: "hg" },
    { id: "sciences", nom: "Sciences et technologie", couleur: "sc" },
    { id: "langues", nom: "Langues vivantes", couleur: "lv" },
    { id: "emc", nom: "Enseignement moral et civique", couleur: "em" },
    { id: "pluri", nom: "Plusieurs matières", couleur: "pl" }
  ];
  var NIVEAUX = ["CP", "CE1", "CE2", "CM1", "CM2", "6e"];

  function lire(cle) {
    try { var r = localStorage.getItem(cle); return r ? JSON.parse(r) : null; } catch (e) { return null; }
  }
  function compterEtoiles(stars) {
    var n = 0, faites = 0;
    if (stars) for (var k in stars) { if (stars[k] > 0) { faites++; n += stars[k]; } }
    return { faites: faites, etoiles: n };
  }

  var MODULES = [
    {
      id: "london-express",
      titre: "London Express",
      accroche: "Anglais : apostrophes de possession et adjectifs dans le bon ordre",
      niveau: "CE2",
      domaine: "langues",
      sousDomaine: "Anglais",
      competences: [
        "Écrire le possessif : Anna's ball, the girls' hats, the children's keys",
        "Distinguer simple pluriel et possession (dogs / dog's)",
        "Transformer « belongs to » en phrase : It is… / They are…",
        "Ranger les adjectifs (opinion, size, shape, age, colour, origin, material, purpose), virgules, a / an"
      ],
      echeance: null,
      echeanceLabel: "Cahier d'anglais : leçon 4 (adjectifs) et leçon 6 (apostrophes)",
      creation: "2026-11-11",
      chemin: "modules/london-express/",
      cleProgression: "london-express-carlo-v2",
      missions: 5,
      epreuve: "Le Test de Wembley",
      fichiers: [],
      progression: function () {
        var s = lire(this.cleProgression);
        var c = compterEtoiles(s && s.stars);
        return { faites: c.faites, total: this.missions, etoiles: c.etoiles, etoilesMax: this.missions * 3,
          epreuve: s && s.boss && s.boss.length ? Math.max.apply(null, s.boss.map(function (b) { return b.score; })) + " / 14" : null };
      }
    },
    {
      id: "ecureuil-agile",
      titre: "L'Écureuil Agile",
      accroche: "Dictée « L'écureuil », a ou à, verbes en -er au présent",
      niveau: "CE2",
      domaine: "francais",
      sousDomaine: "Étude de la langue",
      competences: [
        "Orthographier les mots de la dictée (lettres muettes, ss, tt, g/j)",
        "Distinguer les homophones a / à",
        "Conjuguer les verbes en -er au présent"
      ],
      echeance: "2026-11-09",
      echeanceLabel: "Dictée et devoirs du lundi 9 novembre",
      creation: "2026-11-07",
      chemin: "modules/ecureuil-agile/",
      cleProgression: "ecureuil-agile-carlo-v1",
      missions: 9,
      epreuve: "La Grande dictée",
      fichiers: [],
      progression: function () {
        var s = lire(this.cleProgression);
        var c = compterEtoiles(s && s.stars);
        return { faites: c.faites, total: this.missions, etoiles: c.etoiles, etoilesMax: this.missions * 3,
          epreuve: s && s.boss && s.boss.length ? Math.max.apply(null, s.boss.map(function (b) { return b.score; })) + " / 16" : null };
      }
    },
    {
      id: "gardien-du-temps",
      titre: "Gardien du Temps",
      accroche: "Mesurer le temps, chiffres romains, siècles et grandes périodes",
      niveau: "CE2",
      domaine: "qlm",
      sousDomaine: "Se situer dans le temps",
      competences: [
        "Connaître les instruments et les unités de mesure du temps",
        "Écrire une date, connaître l'origine du calendrier",
        "Lire et écrire les chiffres romains, convertir une date en siècle",
        "Situer les 5 grandes périodes sur une frise chronologique"
      ],
      echeance: "2026-11-05",
      echeanceLabel: "Évaluation du jeudi 5 novembre",
      creation: "2026-10-21",
      chemin: "modules/gardien-du-temps/",
      cleProgression: "gardien-temps-carlo-v1",
      missions: 8,
      epreuve: "L'évaluation blanche",
      fichiers: ["bougie", "cadran", "calendrier", "caravelle", "charlemagne", "chateau", "chrono", "clepsydre", "colisee",
        "debarquement", "gregoire", "horloge", "jo", "marignan", "mecanique", "montre", "notredame", "prehistoire",
        "pyramide", "revolution", "sablier", "terre", "train"].map(function (n) { return "modules/gardien-du-temps/photos/" + n + ".jpg"; }),
      progression: function () {
        var s = lire(this.cleProgression);
        var c = compterEtoiles(s && s.stars);
        return { faites: c.faites, total: this.missions, etoiles: c.etoiles, etoilesMax: this.missions * 3,
          epreuve: s && s.boss && s.boss.length ? Math.max.apply(null, s.boss.map(function (b) { return b.score; })) + " / 14" : null };
      }
    },
    {
      id: "champions-des-tables",
      titre: "Champions des Tables",
      accroche: "Tables de multiplication, calcul mental et problèmes de foot",
      niveau: "CE2",
      domaine: "maths",
      sousDomaine: "Nombres et calculs",
      competences: [
        "Connaître les tables de 0 à 5 dans les deux sens (5 × 4 = 20, 5 × ? = 20)",
        "Calculer mentalement des additions et des soustractions jusqu'à 1 000",
        "Résoudre des problèmes en une ou deux étapes"
      ],
      echeance: null,
      echeanceLabel: "Stage de 10 jours, puis défi de la maîtresse : 120 calculs en 10 minutes",
      creation: "2026-10-23",
      chemin: "modules/champions-des-tables/",
      cleProgression: "champions-des-tables-v1",
      missions: 10,
      epreuve: "Le défi de la maîtresse",
      fichiers: [],
      progression: function () {
        var s = lire(this.cleProgression);
        var jours = s && s.planDays ? Object.keys(s.planDays).length : 0;
        var etoiles = 0;
        if (s && s.plan) etoiles = Object.keys(s.plan).length;
        var rec = s && s.records && s.records.full;
        return { faites: jours, total: this.missions, etoiles: Math.min(etoiles, 29), etoilesMax: 29,
          epreuve: rec ? (rec.ms ? "réussi" : rec.ok + " / 120") : null };
      }
    },
    /* ---------- Archives : modules créés avant la charte, gardés dans leur format d'origine ---------- */
    {
      id: "champions-du-cp",
      archive: true,
      titre: "Champions du CP",
      accroche: "Compter, lire et écrire : les quatre premiers mois du CP, sur le thème du sport",
      niveau: "CP",
      domaine: "pluri",
      sousDomaine: "Mathématiques, lecture et écriture",
      competences: [
        "Compter jusqu'à 20, comparer, additionner, compléments à 10",
        "Reconnaître voyelles, lettres et syllabes ; lire des mots simples",
        "Tracer chiffres et lettres (capitales et écriture attachée)"
      ],
      echeance: null,
      echeanceLabel: "Préparation de la rentrée au CP",
      creation: "2026-08-14",
      chemin: "modules/champions-du-cp/",
      missions: 0,
      fichiers: ["modules/champions-du-cp/icons/icon-192.png"]
    },
    {
      id: "foot-maths",
      archive: true,
      titre: "Foot & Maths",
      accroche: "La carrière de Carlo : révision des maths de CE1 pour entrer en CE2",
      niveau: "CE1",
      domaine: "maths",
      sousDomaine: "Nombres et calculs",
      competences: [
        "Additions et soustractions avec retenue, compléments à 10, 100, 1 000",
        "Tables de multiplication, doubles et moitiés",
        "Numération : unités, dizaines, centaines ; comparer et ranger",
        "Problèmes sur le thème du foot"
      ],
      echeance: null,
      echeanceLabel: "Révisions de l'été, passage en CE2",
      creation: "2026-08-14",
      chemin: "modules/foot-maths/",
      missions: 0,
      fichiers: ["modules/foot-maths/favicon.png"]
    },
    {
      id: "maths-ce1",
      archive: true,
      titre: "Maths CE1 avec Carlo",
      accroche: "Additions, soustractions, tables, heure et monnaie : le premier jeu de maths",
      niveau: "CE1",
      domaine: "maths",
      sousDomaine: "Nombres, calculs, grandeurs et mesures",
      competences: [
        "Additionner, soustraire, trouver le nombre manquant",
        "Comparer des nombres, doubles et moitiés",
        "Tables de 2, 5 et 10",
        "Lire l'heure, rendre la monnaie en euros"
      ],
      echeance: null,
      echeanceLabel: "Révisions de l'été 2025, passage en CE1",
      creation: "2025-08-17",
      chemin: "modules/maths-ce1/",
      missions: 0,
      fichiers: []
    }
  ];

  window.CLF = window.CLF || {};
  window.CLF.DOMAINES = DOMAINES;
  window.CLF.NIVEAUX = NIVEAUX;
  window.CLF.MODULES = MODULES;
})();
