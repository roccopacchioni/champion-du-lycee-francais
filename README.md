# Champion du Lycée Français

Site de révision gamifié pour les élèves du lycée français : chaque « cahier » est un jeu court construit à partir des leçons et des évaluations de la classe, selon les programmes de l'école élémentaire française. Le site est pensé pour les enfants qui ont du mal à rester concentrés : missions de 4 minutes, consignes lues à voix haute, deuxième chance après une erreur, pause cerveau, récompenses à chaque étape.

Il fonctionne sur téléphone, tablette et ordinateur (Safari, Chrome, Edge, Firefox), s'installe sur l'écran d'accueil et reste jouable sans connexion. Aucune donnée ne quitte l'appareil.

## Cahiers disponibles

| Cahier | Classe | Matière | Contenu |
|---|---|---|---|
| L'Écureuil Agile | CE2 | Français | Dictée « L'écureuil », a / à, présent des verbes en -er |
| Champions des Tables | CE2 | Mathématiques | Tables de 0 à 5, calcul mental, problèmes |
| Gardien du Temps | CE2 | Questionner le monde | Mesure du temps, calendrier, chiffres romains, siècles, frise |
| London Express | CE2 | Langues vivantes (anglais) | Apostrophes de possession, It is / They are, ordre des adjectifs, a / an |
| Foot & Maths (archive) | CE1 | Mathématiques | Révision CE1 → CE2 sur le thème du foot |
| Maths CE1 avec Carlo (archive) | CE1 | Mathématiques | Calculs, tables de 2, 5 et 10, heure, monnaie |
| Champions du CP (archive) | CP | Plusieurs matières | Compter, lire, écrire : les quatre premiers mois du CP |

La page **Tous les modules** (`modules.html`) les présente tous, rangés par classe. Les archives sont les premiers jeux, gardés dans leur format d'origine.

## Publier sur GitHub Pages

1. Sur github.com, créer un dépôt **public** nommé par exemple `champion-du-lycee-francais`.
2. Bouton **Add file → Upload files** : glisser tout le contenu de ce dossier (pas le dossier lui-même), y compris le fichier caché `.nojekyll`, puis **Commit changes**.
3. **Settings → Pages** : *Source* = « Deploy from a branch », *Branch* = `main`, dossier `/ (root)`, puis **Save**.
4. Après une à deux minutes, le site est en ligne à l'adresse `https://<votre-identifiant>.github.io/champion-du-lycee-francais/`.

Sur Mac, le fichier `.nojekyll` est masqué dans le Finder : appuyer sur `Cmd + Maj + .` pour l'afficher avant de glisser les fichiers.

## Ajouter un cahier

1. Créer le dossier `modules/<identifiant>/` avec son `index.html` (et `photos/` si besoin), en respectant **CHARTE-MODULES.md**.
2. Ajouter son entrée dans `assets/catalogue.js`.
3. Envoyer les fichiers sur GitHub : l'accueil, la vitrine, l'espace parents et le mode hors ligne le prennent en compte automatiquement.

Les mises à jour arrivent automatiquement : le site va chercher la dernière version en ligne et ne se sert de la copie locale que sans connexion. Changer `VERSION` en tête de `sw.js` vide seulement les anciennes copies.

## Organisation des fichiers

```
index.html               accueil : mission du jour, vitrine, cahiers par matière
modules.html             tous les modules, rangés par classe
parents.html             espace parents : progrès, séance type, réglages, sauvegarde
assets/catalogue.js      liste des cahiers (seul fichier à modifier pour en ajouter un)
assets/commun.js         fonctions partagées (prénom, rangs, temps de jeu)
assets/module-bridge.js  lien entre le site et chaque jeu
assets/accueil.js        logique de l'accueil
assets/parents.js        logique de l'espace parents
assets/site.css          styles du site
modules/                 un dossier par cahier
sw.js                    mode hors ligne
manifest.webmanifest     installation sur l'écran d'accueil
CHARTE-MODULES.md        règles communes à tous les cahiers
```

## Crédits

Photos du Gardien du Temps : Wikimedia Commons, licences libres (détail dans l'espace parents du jeu). Polices : Andika, Lilita One et Playwrite FR Trad (Google Fonts, licence OFL).

Site personnel créé par des parents d'élèves, indépendant de l'établissement.
