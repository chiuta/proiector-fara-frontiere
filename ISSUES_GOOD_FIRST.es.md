# Buenas primeras tareas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · **Español** · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Probar todo el recorrido en un iPhone real (Safari) y en un teléfono Android real (Chrome) con la lista de comprobación de `docs/compat.md`, y añadir tus filas a su tabla
- [ ] Probar el emparejamiento en una red doméstica, en un Wi-Fi escolar o de invitados que aísla los dispositivos y en un punto de acceso móvil; anotar en `docs/compat.md` qué funciona y los mensajes de error exactos
- [ ] Conseguir un archivo de cuestionario Undava real (o su especificación publicada) y hacer que el importador de cuestionarios lo lea, con una prueba y una nota en `docs/quiz-format.md`
- [ ] Añadir un widget «levantar la mano»: los teléfonos hacen cola, el proyector muestra el orden y deja que el docente llame al siguiente (permiso `none`)
- [ ] Añadir un widget de ticket de salida: cada teléfono elige una cara o un número del 1 al 5 y puede añadir un comentario breve; el proyector muestra los totales y los comentarios, con exportación CSV
- [ ] Añadir un widget para formar grupos: el proyector reparte los teléfonos conectados en grupos de un tamaño elegido, con un botón para volver a mezclar, y cada teléfono ve su grupo
- [ ] Cuestionario: añadir un segundo CSV con la respuesta de cada teléfono a cada pregunta, para que el docente vea quién falló en qué
- [ ] Auditar la página con un lector de pantalla (NVDA o VoiceOver) y solo con el teclado, corregir lo que no se anuncia o no se alcanza y anotar el resultado en `docs/compat.md`
- [ ] Revisar las traducciones automáticas de la interfaz y de los widgets (fr, de, es, it, pt, hu) y corregir lo que un hablante nativo no diría
- [ ] Ampliar la prueba en navegador del hub (`tests/proiector.test.mjs`) a diez o más teléfonos simulados que dibujan a la vez, e informar de lo receptivo que sigue el proyector

Créalas todas en GitHub con `scripts/create_issues.sh` (requiere la CLI `gh`).
