# Charte des modules : Champion du Lycée Français

Tous les modules du site suivent les mêmes règles, pour qu'un enfant qui a du mal à rester concentré retrouve exactement les mêmes repères d'un jeu à l'autre. Cette charte s'appuie sur les modules de référence **L'Écureuil Agile** et **Gardien du Temps**. Tout nouveau module doit la respecter point par point.

## 1. Le contenu : le programme de la classe

- Chaque module part d'une source réelle : leçon, fiche d'exercices, évaluation annoncée, liste de mots de la dictée.
- Il cible **un niveau** (CP, CE1, CE2, CM1, CM2) et **un domaine du programme** de l'école française : Français, Mathématiques, Questionner le monde (cycle 2), Histoire et géographie, Sciences et technologie (cycle 3), Langues vivantes, Enseignement moral et civique.
- Les objectifs sont formulés comme dans le programme (« Distinguer les homophones a / à », « Convertir une date en siècle ») : de 4 à 7 objectifs par module, suivis séparément dans l'espace parents.
- Vocabulaire, consignes et méthodes sont ceux de l'école française : écriture attachée, « cherche un mot de la même famille », « remplace par avait », les poings pour les mois, etc.
- Les coquilles ou pièges des fiches de la classe sont signalés aux parents.

## 2. La structure d'un module

| Élément | Règle |
|---|---|
| Accueil | Prénom de l'enfant, compte à rebours « J-x » avant l'évaluation, métaphore de collection qui se remplit (garde-manger, machine à rouages), **un seul gros bouton « À jouer maintenant »**. |
| Carte des missions | 8 à 9 missions sur un chemin ou une frise verticale, de la plus simple à la plus dure. La prochaine mission est encadrée. |
| Mission | **6 questions**, environ **4 minutes**. Questions tirées au hasard dans plusieurs groupes pour varier les formats. |
| Formats de questions | QCM à gros boutons, reconstitution (étiquettes à remettre dans l'ordre, morceaux de mots), clavier à l'écran avec accents français, photo-flash (le mot s'affiche puis disparaît). |
| Épreuve finale | Une épreuve au format de l'évaluation en classe (Grande dictée, évaluation blanche), avec bilan par objectif et récompense spéciale. |
| Mission revanche | Rejoue uniquement les questions ratées (30 au plus, 8 par partie). |
| Album | Un objet à collectionner débloqué par mission (carte illustrée avec un petit texte documentaire), plus un objet rare pour l'épreuve finale. |
| Espace parents | Maîtrise par objectif (acquis / en progrès / à retravailler), plan de révision jour par jour jusqu'à l'évaluation, points d'attention sur les fiches, conseils, réglages son et voix, remise à zéro avec confirmation. |

## 3. Les règles pour l'attention

1. **Une seule chose à décider** : l'accueil propose toujours la mission suivante. Pas de menu à choix multiples pour l'enfant.
2. **Une consigne à la fois**, lue à voix haute en français (synthèse vocale fr-FR, vitesse 0,85 à 0,92), avec un bouton haut-parleur pour réécouter.
3. **Retour immédiat** après chaque réponse, dans un panneau en bas d'écran : « Bravo ! » ou « Presque… », la bonne réponse, la règle en une phrase, le bouton « Continuer ».
4. **L'erreur donne une deuxième chance** : la question ratée revient en fin de mission. Le message le dit explicitement (« Pas grave : cette question reviendra… »).
5. **Indice à la demande** (bouton ampoule) : il réduit le gain (10 → 6) mais ne pénalise jamais.
6. **Récompenses fréquentes et visibles** : +10 par bonne réponse, bonus de série tous les 3 sans faute, 3 étoiles par mission (3 sans erreur, 2 jusqu'à 2 erreurs, 1 sinon), animation courte et son de réussite.
7. **Pause cerveau** de 30 secondes après chaque mission : une consigne de mouvement en lien avec le thème, minuteur circulaire, bouton « J'ai fini ! » actif après 10 secondes.
8. **Le temps rassure, il ne menace pas** : pas de chronomètre dans les missions. Le chrono n'existe que dans un défi choisi.
9. **Séance courte** : deux missions puis la pause. Le site affiche un rappel de fin de séance (20 minutes par défaut).
10. **Finir sur une réussite** : écran de fin avec étoiles, gain, objet débloqué, puis « Pause cerveau » en premier bouton.

## 4. La forme

- Une colonne de 560 px maximum, centrée, utilisable au téléphone, à la tablette et à l'ordinateur ; marges `max(16px, env(safe-area-inset-*))`.
- Zones tactiles d'au moins 48 px (56 px pour les boutons principaux). Clavier physique accepté (chiffres, lettres, Entrée, Retour arrière).
- Polices : **Andika** pour le texte (conçue pour les lecteurs débutants), **Lilita One** pour les titres.
- Un thème visuel unique et ludique par module (forêt, machine à remonter le temps, stade), lié au sujet ou aux passions de l'enfant.
- Mode clair et mode sombre, animations désactivées si l'appareil le demande (`prefers-reduced-motion`).
- Dessins en SVG intégrés ; photos seulement sous licence libre, crédits dans l'espace parents.
- Navigateurs : Safari (iOS 16 et plus), Chrome, Edge, Firefox récents.

## 5. La technique

- Un fichier `modules/<identifiant>/index.html` autonome, éventuellement avec un dossier `photos/`.
- Progression enregistrée dans `localStorage` sous une clé propre au module (`<identifiant>-v1`), sans compte ni envoi de données.
- Dans le `<head>`, les trois scripts du site :

```html
<script src="../../assets/catalogue.js"></script>
<script src="../../assets/commun.js"></script>
<script src="../../assets/module-bridge.js" data-module="mon-module"></script>
```

  Ils ajoutent le bouton « Mes modules », remplacent le prénom d'origine par celui choisi dans l'espace parents, comptent le temps de jeu, affichent le rappel de fin de séance et activent le mode hors ligne.
- Une entrée dans `assets/catalogue.js` : titre, niveau, domaine, compétences, date de l'évaluation, nombre de missions, clé de progression et fonction `progression()` qui renvoie `{ faites, total, etoiles, etoilesMax, epreuve }`. Pour un module construit sur le modèle de l'Écureuil Agile, la fonction de l'Écureuil se recopie telle quelle.
