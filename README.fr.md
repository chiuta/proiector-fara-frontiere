# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.2.1 · Dernière mise à jour : 2026-11-22

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transformez les téléphones d'une classe en écran partagé via WebRTC local — sans serveur, avec widgets-plugins.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha, utilisable : la page du projecteur et cinq activités (minuteur, sondage, quiz, notes autocollantes, tableau blanc) fonctionnent dans l’unique fichier `index.html` : ouvrez-le sur l’appareil de l’enseignant, ajoutez des téléphones avec un code QR ou texte, sans serveur et sans compte. Les activités s’exécutent dans des cadres isolés. Ce qui n’a pas été testé (vrais téléphones, navigateurs autres que Chromium, vrai Wi-Fi) est indiqué plus bas et dans `docs/compat.md`.

## Ce que fait l’application

- Deux rôles dans une seule page : au projecteur (il affiche l’écran partagé et pilote les activités) et comme téléphone (il rejoint et participe). Une session accueille jusqu’à 30 téléphones.
- Appairage sans serveur : chaque téléphone est appairé au projecteur en échangeant un code, sous forme d’images QR, de photo du code ou de texte collé ; sans compte, sans serveur de signalisation, sans suivi. Par défaut, rien ne quitte le réseau local.
- Cinq activités : un minuteur à rebours ; un sondage avec barres en direct et un CSV du résultat ; un quiz (fichiers de questions JSON, texte simple ou CSV, bonus de rapidité, classement, un CSV des scores, jusqu’à cinq séries enregistrées sur l’appareil) dont la bonne réponse reste sur le projecteur jusqu’à sa révélation ; des notes autocollantes de tous les téléphones avec export texte ; un tableau blanc avec une couleur par téléphone et un export PNG.
- Commandes de l’enseignant : verrouiller ou déverrouiller un téléphone ou tous, retirer un téléphone, plein écran, garder l’écran allumé, terminer la session. Un téléphone qui se déconnecte puis revient retrouve son nom et sa couleur.
- Chaque appareil a sa propre langue (huit) et son propre aspect : clair ou sombre, fort contraste, grand texte.
- Une API de widgets et un modèle de permissions documenté (`docs/widget-api.md`, `docs/sandbox.md`) : une nouvelle activité, c’est un descripteur dans `data/widgets/` plus un script dans `widgets/`.
- Prise en charge du clavier et des lecteurs d’écran, grandes cibles tactiles, mise en page pour écrans étroits de téléphone ; sans suivi, sans comptes, fonctionne hors ligne.
- Installable comme une application et disponible hors ligne après la première visite lorsqu’elle est servie en HTTPS (un service worker conserve la page ; rien d’autre n’est stocké ni envoyé). Ouverte depuis un fichier téléchargé, elle fonctionne de la même manière, sans installation.

## Comment ça marche

- `node scripts/build.mjs` assemble l’unique `index.html` à partir de `src/` (`engine.mjs` pour la logique pure, `ui.js` pour l’interface, `sandbox.js` pour le code qui s’exécute dans un cadre, `i18n.mjs`, `app.css`, `sandbox.css`) et de `widgets/` ; `--check` vérifie que la page correspond aux sources, y compris l’empreinte de chaque widget.
- Le projecteur fait autorité : un téléphone envoie des demandes, et le projecteur contrôle la version du protocole, les noms, les identifiants de widget, la taille des messages, le débit et les permissions avant d’utiliser quoi que ce soit (`docs/protocol.md`). Votes, réponses et scores restent sur le projecteur.
- Chaque activité s’exécute dans `<iframe sandbox="allow-scripts" srcdoc>` : sans origine, avec une politique `default-src 'none'`, un canal de messages privé et seulement les permissions de son descripteur ; la page elle-même n’autorise aucune requête réseau (`docs/sandbox.md`).
- Les téléphones et le projecteur communiquent par des canaux de données WebRTC appairés à la main (images QR ou texte collé) ; rien ne passe par un serveur et, sans serveur STUN saisi par vous, aucune requête ne quitte le réseau local.
- `npm test` vérifie le moteur, les limites du protocole, l’importateur de quiz, les widgets, les traductions de l’interface et des widgets, les fichiers PWA et la documentation ; le test navigateur du hub (`tests/proiector.test.mjs`) ouvre la page dans de vrais navigateurs Chromium, avec de vraies connexions WebRTC, un widget hostile et des téléphones hostiles. Le développement demande Node.js 24 ou plus récent ; la page elle-même demande un navigateur avec ES2017 et les canaux de données WebRTC.
- `manifest.webmanifest`, `sw.js` et les icônes sont produits par `node scripts/build.mjs` via le kit commun (section `pwa` de `src/app.json`) ; `--check` les vérifie aussi, et `npm test` contrôle que le manifeste, la version du service worker et la CSP correspondent à la page.

## Limites

- Alpha : aucun vrai téléphone ni vraie tablette, et aucun navigateur autre que Chromium, ne l’a fait tourner ; tout a été testé dans Chromium, avec de vraies connexions WebRTC sur une seule machine (`docs/compat.md`).
- Par défaut, l’appairage ne marche que sur le même réseau local. Un serveur STUN que vous saisissez peut le permettre entre réseaux (non essayé ici), mais il n’y a pas de relais (pas de TURN) : le Wi-Fi invité qui isole les appareils, les VPN et de nombreux réseaux scolaires, d’entreprise et mobiles peuvent donc encore le bloquer. Chaque téléphone demande son propre échange de codes, donc ajouter une classe entière prend quelques minutes.
- L’appairage montre l’adresse IP de chaque appareil à l’autre (la boîte de dialogue demande d’abord). Le canal est chiffré, mais l’identité de l’autre appareil n’est pas vérifiée : n’appairez que dans votre propre salle.
- Le bac à sable n’empêche pas une activité hostile de figer son propre cadre (dans certains navigateurs, tout l’onglet), et une activité peut utiliser son canal privé jusqu’à ses limites. N’ajoutez que des activités dont vous avez lu le code source (`docs/sandbox.md`).
- Le quiz lit des fichiers JSON, texte simple et CSV. Le format « Undava » demandé dans le premier plan n’a été trouvé documenté nulle part et n’a pas été testé avec de vrais fichiers Undava (`docs/quiz-format.md`).
- D’une session à l’autre, un appareil ne conserve que ses propres réglages (nom, fort contraste, grand texte) et les séries de quiz que vous choisissez d’enregistrer ; les résultats, les notes et les dessins ne sont pas conservés si vous ne les téléchargez pas. Un projecteur qui recharge la page met fin à la session et les téléphones doivent être appairés de nouveau.
- Une session accueille jusqu’à 30 téléphones, limite imposée par le moteur ; les tests dans le navigateur ont utilisé au plus trois connexions réelles.
- L’interface et les activités existent en huit langues ; celles en français, italien, espagnol, portugais, allemand et hongrois ont été traduites automatiquement et n’ont pas été relues par des locuteurs natifs.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/widgets/example.json` vers `data/widgets/<id>.json` et modifiez-le (schéma dans `schema.json`), puis lancez `python scripts/validate.py`.
3. Écrivez `widgets/<id>/index.js` (voir `docs/widget-api.md`) : `export function mount(container, api)` et `strings` dans les huit langues.
4. Testez les fonctions pures dans `test/widgets.test.mjs`, puis lancez `npm test` et `node scripts/build.mjs`.
5. Ouvrez une pull request avec le `index.html` régénéré.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
