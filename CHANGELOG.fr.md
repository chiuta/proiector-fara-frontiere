# Journal des modifications

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · **Français** · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non publié]

## [0.2.1] - 2026-11-20

### Modifié
- fff-kit 1.8.1 : lorsque le navigateur bloque le stockage ou en est dépourvu (`localStorage`/`sessionStorage` lèvent une erreur ou sont absents), la page démarre avec un stockage temporaire en mémoire au lieu de s’arrêter ; les données ne sont pas conservées après la fermeture de la page.
- fff-kit 1.8.1 : le dispositif qui agrandit les petits contrôles à 44 px mesure désormais aussi la largeur du corps de la page et de l’élément parent ; une rangée de boutons ne peut donc plus sortir de l’écran (le groupe reste inchangé lorsque l’agrandissement le ferait déborder).

## [0.2.0] - 2026-11-17

### Ajouté
- La page du projecteur et du téléphone : un seul `index.html`, construit à partir de `src/` et `widgets/` par `node scripts/build.mjs` (`--check` le vérifie), avec l’écran partagé, les commandes et la vue du téléphone dans le même fichier.
- Appairage sans serveur par échange de codes (images QR, photo du code ou texte collé), jusqu’à 30 téléphones par session ; commandes de l’enseignant pour verrouiller ou déverrouiller, retirer un téléphone, passer en plein écran, garder l’écran allumé et terminer la session.
- Cinq activités : minuteur, sondage, quiz, notes autocollantes et tableau blanc, avec des exports CSV, texte et PNG là où ils s’appliquent.
- L’API des widgets et l’isolation de chaque activité dans un cadre en bac à sable, avec les permissions `none`, `drawing`, `storage` et `download` (`camera` et `microphone` sont réservées et refusées) : `docs/widget-api.md` et `docs/sandbox.md`.
- Le protocole projecteur–téléphone avec ses limites (téléphones, noms, taille des messages, débit, données enregistrées), une session qui se resynchronise quand une connexion faible revient et des exports CSV qui neutralisent les cellules commençant par un caractère de formule : `docs/protocol.md`.
- Des fichiers de quiz en JSON, texte simple ou CSV, lus par un importateur tolérant et documentés en anglais et en roumain dans `docs/quiz-format.md` ; le format « Undava » n’est pas revendiqué, faute de spécification trouvée.
- Huit langues pour l’interface et les activités, une langue et un aspect (clair, sombre, fort contraste, grand texte) choisis sur chaque appareil, et la prise en charge du clavier et des lecteurs d’écran.
- Tests : `npm test` (moteur, limites du protocole, importateur de quiz, widgets, traductions, fichiers PWA, construction et documentation), un test navigateur dans le hub avec de vraies connexions WebRTC, un widget hostile et des téléphones hostiles, et `docs/compat.md` avec une liste de contrôle pour de vrais appareils.
- README, CHANGELOG, CONTRIBUTING et ISSUES_GOOD_FIRST réécrits pour cette version dans huit langues, avec dix tâches pour débuter.
- ISSUES_GOOD_FIRST et CODE_OF_CONDUCT traduits dans les huit langues.
- README en anglais, roumain, français, italien, espagnol, portugais, allemand et hongrois : sections d’état et de périmètre prévu (dérivées de `ISSUES_GOOD_FIRST.md`).
- Installable (PWA) : `manifest.webmanifest`, `sw.js` et les icônes sont générés par le kit commun (`fff-kit/pwa`) ; la page fonctionne hors ligne après la première visite en HTTPS.

### Modifié
- `data/widgets/example.json` est maintenant un descripteur modèle (`my-widget`, avec des traductions en huit langues) ; le descripteur du minuteur a été déplacé vers `data/widgets/timer.json`, à côté de `poll`, `quiz`, `notes` et `whiteboard`.
- `widgets/timer/index.js` est maintenant le vrai minuteur et non plus l’exemple de démonstration.
- `schema.json` : `description` et `i18n` sont obligatoires (l’anglais est obligatoire, les sept autres langues sont signalées par le validateur), `id` et `entry` doivent suivre une forme fixe, et `permissions` accepte de une à trois valeurs parmi `none`, `drawing`, `storage` et `download` ; `camera` et `microphone` ne sont plus acceptées.
- `scripts/validate.py` vérifie aussi que `id` est égal au nom du fichier, que `entry` existe et exporte `mount`, que les permissions réservées sont refusées avec un message clair et que les traductions sont complètes (un avertissement, ou une erreur avec `--strict`).
- Le workflow s’exécute sur Ubuntu 26.04 avec Node.js 26 et lance aussi les tests et la vérification de la construction.

## [0.1.0] - 2026-11-13

### Ajouté
- Squelette initial : structure, schéma de données ou premiers exemples, guides de contribution en huit langues.
