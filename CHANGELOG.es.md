# Registro de cambios

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · **Español** · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Sin publicar]

## [0.2.1] - 2026-11-20

### Cambiado
- fff-kit 1.8.1: cuando el navegador bloquea el almacenamiento o carece de él (`localStorage`/`sessionStorage` lanzan un error o no existen), la página arranca con un almacenamiento temporal en memoria en lugar de detenerse; los datos no se conservan al cerrar la página.
- fff-kit 1.8.1: la guía que amplía los controles pequeños a 44 px mide ahora también el ancho del cuerpo de la página y del elemento padre, de modo que una fila de botones ya no puede salirse de la pantalla (el grupo se deja intacto cuando la ampliación lo haría demasiado ancho).

## [0.2.0] - 2026-11-17

### Añadido
- La página del proyector y del teléfono: un solo `index.html`, construido a partir de `src/` y `widgets/` con `node scripts/build.mjs` (`--check` lo verifica), con la pantalla compartida, los controles y la vista del teléfono en el mismo archivo.
- Emparejamiento sin servidor mediante intercambio de códigos (fotogramas QR, foto del código o texto pegado), hasta 30 teléfonos por sesión; controles del docente para bloquear o desbloquear, quitar un teléfono, pasar a pantalla completa, mantener la pantalla encendida y terminar la sesión.
- Cinco actividades: temporizador, encuesta, cuestionario, notas adhesivas y pizarra, con exportaciones CSV, texto y PNG donde corresponda.
- La API de widgets y el aislamiento de cada actividad en un marco aislado, con los permisos `none`, `drawing`, `storage` y `download` (`camera` y `microphone` están reservados y se rechazan): `docs/widget-api.md` y `docs/sandbox.md`.
- El protocolo proyector–teléfono con sus límites (teléfonos, nombres, tamaño de los mensajes, ritmo, datos guardados), una sesión que se resincroniza cuando vuelve una conexión débil y exportaciones CSV que neutralizan las celdas que empiezan por un carácter de fórmula: `docs/protocol.md`.
- Archivos de cuestionario en JSON, texto simple o CSV, leídos por un importador tolerante y documentados en inglés y rumano en `docs/quiz-format.md`; el formato «Undava» no se afirma, porque no se encontró ninguna especificación.
- Ocho idiomas para la interfaz y las actividades, un idioma y un aspecto (claro, oscuro, alto contraste, texto grande) elegidos en cada dispositivo, y compatibilidad con el teclado y los lectores de pantalla.
- Pruebas: `npm test` (motor, límites del protocolo, importador de cuestionarios, widgets, traducciones, archivos PWA, compilación y documentación), una prueba en navegador en el hub con conexiones WebRTC reales, un widget hostil y teléfonos hostiles, y `docs/compat.md` con una lista de comprobación para dispositivos reales.
- README, CHANGELOG, CONTRIBUTING e ISSUES_GOOD_FIRST reescritos para esta versión en ocho idiomas, con diez tareas para empezar.
- ISSUES_GOOD_FIRST y CODE_OF_CONDUCT traducidos a los ocho idiomas.
- README en inglés, rumano, francés, italiano, español, portugués, alemán y húngaro: secciones de estado y de alcance previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalable (PWA): `manifest.webmanifest`, `sw.js` y los iconos los genera el kit común (`fff-kit/pwa`); la página funciona sin conexión tras la primera visita por HTTPS.

### Cambiado
- `data/widgets/example.json` es ahora un descriptor plantilla (`my-widget`, con traducciones en ocho idiomas); el descriptor del temporizador se movió a `data/widgets/timer.json`, junto a `poll`, `quiz`, `notes` y `whiteboard`.
- `widgets/timer/index.js` es ahora el temporizador real y ya no el ejemplo de demostración.
- `schema.json`: `description` e `i18n` son obligatorios (el inglés es obligatorio, los otros siete idiomas los señala el validador), `id` y `entry` deben seguir una forma fija, y `permissions` acepta de uno a tres valores entre `none`, `drawing`, `storage` y `download`; `camera` y `microphone` ya no se aceptan.
- `scripts/validate.py` comprueba además que `id` sea igual al nombre del archivo, que `entry` exista y exporte `mount`, que los permisos reservados se rechacen con un mensaje claro y que las traducciones estén completas (una advertencia, o un error con `--strict`).
- El workflow se ejecuta en Ubuntu 26.04 con Node.js 26 y ejecuta también las pruebas y la comprobación de la compilación.

## [0.1.0] - 2026-11-13

### Añadido
- Esqueleto inicial: estructura, esquema de datos o primeros ejemplos, guías de contribución en ocho idiomas.
