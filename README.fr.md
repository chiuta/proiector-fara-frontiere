# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · **Français** · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 0.1.0 · Dernière mise à jour : 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transformez les téléphones d'une classe en écran partagé via WebRTC local — sans serveur, avec widgets-plugins.

Trade-free : sans suivi, sans publicité, sans compte, fonctionne hors ligne.

## État

Alpha : le dépôt contient la structure, le schéma de données ou les premiers exemples et les guides de contribution. Le périmètre ci-dessous est le plan, pas ce qui fonctionne aujourd’hui.

## Périmètre prévu

- Appairage sans serveur : un code QR et un échange WebRTC offre/réponse, pour que les téléphones se joignent sans aucun serveur.
- Une API de widgets (montage/démontage, envoi/écoute, cycle de vie) et un bac à sable de widgets (iframe + postMessage) avec un modèle de permissions documenté.
- Widgets : un sondage avec diagramme en direct, un quiz compatible avec les fichiers de quiz Undava, des notes autocollantes et un tableau blanc avec une couleur par téléphone.
- Une commande enseignant pour verrouiller et déverrouiller les téléphones.
- Un thème d’accessibilité à fort contraste et grande police, et des tests sur iOS Safari et Android Chrome consignés dans `docs/compat.md`.

Rien de tout cela n’est encore implémenté : chaque point est une tâche prête dans `ISSUES_GOOD_FIRST.md`.

## Contribuer en 5 minutes

1. Forkez ce dépôt.
2. Copiez `data/widgets/example.json` dans `data/widgets/` et modifiez-le.
3. Lancez `python scripts/validate.py`.
4. Ouvrez une pull request — aucune programmation n'est nécessaire pour les données.

## Bonnes premières tâches

Voir `ISSUES_GOOD_FIRST.md` pour des tâches toutes prêtes.

## Licence

Code : MIT. Données contribuées : indiquez la source ; elles sont publiées sous la même licence sauf mention contraire.

## Soutien

Si ce projet vous est utile, vous pouvez [m'offrir un café](https://buymeacoffee.com/echo.of.the.strings).
