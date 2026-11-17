# Bonnes premières tâches

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · **Français** · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Tester tout le parcours sur un vrai iPhone (Safari) et un vrai téléphone Android (Chrome) avec la liste de contrôle de `docs/compat.md`, et ajouter ses lignes à son tableau
- [ ] Essayer l’appairage sur un réseau domestique, sur un Wi-Fi scolaire ou invité qui isole les appareils et sur un point d’accès mobile ; consigner dans `docs/compat.md` ce qui marche et les messages d’erreur exacts
- [ ] Obtenir un vrai fichier de quiz Undava (ou sa spécification publiée) et faire en sorte que l’importateur de quiz le lise, avec un test et une note dans `docs/quiz-format.md`
- [ ] Ajouter un widget « lever la main » : les téléphones font la queue, le projecteur montre l’ordre et laisse l’enseignant appeler le suivant (permission `none`)
- [ ] Ajouter un widget de ticket de sortie : chaque téléphone choisit un visage ou un nombre de 1 à 5 et peut ajouter un court commentaire ; le projecteur affiche les totaux et les commentaires, avec un export CSV
- [ ] Ajouter un widget de constitution de groupes : le projecteur répartit les téléphones connectés en groupes d’une taille choisie, avec un bouton de nouveau tirage, et chaque téléphone voit son groupe
- [ ] Quiz : ajouter un second CSV avec la réponse de chaque téléphone à chaque question, pour que l’enseignant voie qui s’est trompé sur quoi
- [ ] Auditer la page avec un lecteur d’écran (NVDA ou VoiceOver) et au clavier seul, corriger ce qui n’est pas annoncé ou pas atteignable, et consigner le résultat dans `docs/compat.md`
- [ ] Relire les traductions automatiques de l’interface et des widgets (fr, de, es, it, pt, hu) et corriger ce qu’un locuteur natif ne dirait pas
- [ ] Étendre le test navigateur du hub (`tests/proiector.test.mjs`) à dix téléphones simulés ou plus qui dessinent en même temps, et rapporter la réactivité qui reste au projecteur

Créez-les toutes sur GitHub avec `scripts/create_issues.sh` (nécessite la CLI `gh`).
