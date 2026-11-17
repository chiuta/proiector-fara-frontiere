# Contribuer — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · **Français** · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version : 0.2.0 · Dernière mise à jour : 2026-11-17

1. Forkez ce dépôt.
2. Copiez `data/widgets/example.json` vers `data/widgets/<id>.json` et modifiez-le (schéma dans `schema.json`), puis lancez `python scripts/validate.py`.
3. Écrivez `widgets/<id>/index.js` (voir `docs/widget-api.md`) : `export function mount(container, api)` et `strings` dans les huit langues.
4. Testez les fonctions pures dans `test/widgets.test.mjs`, puis lancez `npm test` et `node scripts/build.mjs`.
5. Ouvrez une pull request avec le `index.html` régénéré.

## Règles

- Une activité = un descripteur (`data/widgets/<id>.json`) + un widget (`widgets/<id>/index.js`) + des tests.
- Citez toujours une source.
- Ne contribuez qu'avec du matériel que vous pouvez légalement partager (pas de texte protégé copié).
- Soyez bienveillant : voir le Code de conduite.

## Ajouter une activité

1. Ajoutez `data/widgets/<id>.json` (partez de `data/widgets/example.json` ; schéma dans `schema.json`) et lancez `python scripts/validate.py`. L’`id`, le nom du fichier, le répertoire sous `widgets/` et `entry` doivent concorder. Listez le moins de `permissions` possible : `none`, `drawing`, `storage` ou `download` ; `camera` et `microphone` sont réservées et refusées (voir `docs/sandbox.md`).
2. Écrivez `widgets/<id>/index.js` comme module ES (syntaxe ES2017, sans imports) avec `export function mount(container, api)` et `export const strings` dans les huit langues (voir `docs/widget-api.md`). Pas de réseau, pas de stockage du navigateur, pas de `parent`, pas de `eval`, pas de HTML construit à partir de texte : `npm test` les refuse, et le constructeur refuse `<!--`, `<script` et `</script` dans la source.
3. Considérez tout message d’un téléphone comme non fiable : vérifiez types, plages et longueurs sur le projecteur, gardez-y les bonnes réponses et les scores, et n’envoyez aux téléphones que ce dont ils ont besoin. Changer la forme d’un message ou une limite dans `src/engine.mjs` implique d’augmenter `PROTO` et de mettre à jour `docs/protocol.md` (un test compare son tableau avec le code).
4. Stylez le widget dans `widgets/<id>/style.css` avec un préfixe de classe qui vous est propre et les variables du thème. Gardez des cibles tactiles d’au moins 44 pixels, un focus visible, une étiquette pour chaque contrôle et des annonces (`api.announce`) pour ce qui change à l’écran ; vérifiez le fort contraste et le grand texte.
5. Écrivez des tests dans `test/widgets.test.mjs` pour les fonctions pures que vous exportez, avec des données inventées uniquement, et lancez `npm test`.
6. Lancez `node scripts/build.mjs` et validez (commit) `index.html`, `sw.js` et `app.json` régénérés avec `src/` et `widgets/`.
