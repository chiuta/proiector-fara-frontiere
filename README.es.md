# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.2.1 · Última actualización: 2026-11-20

🌐 https://proiector-fara-frontiere.chiuta.ro

> Convierte los teléfonos del aula en una pantalla compartida con WebRTC local — sin servidor, con widgets plugin.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa, utilizable: la página del proyector y cinco actividades (temporizador, encuesta, cuestionario, notas adhesivas, pizarra) funcionan en el único archivo `index.html`: ábrelo en el dispositivo del docente, añade teléfonos con un código QR o de texto, sin servidor y sin cuenta. Las actividades se ejecutan en marcos aislados. Lo que no se ha probado (teléfonos reales, navegadores distintos de Chromium, Wi-Fi real) se enumera más abajo y en `docs/compat.md`.

## Qué hace

- Dos papeles en una sola página: en el proyector (muestra la pantalla compartida y dirige las actividades) y como teléfono (se une y participa). Una sesión admite hasta 30 teléfonos.
- Emparejamiento sin servidor: cada teléfono se empareja con el proyector intercambiando un código, como fotogramas QR, foto del código o texto pegado; sin cuenta, sin servidor de señalización, sin rastreo. Por defecto nada sale de la red local.
- Cinco actividades: un temporizador de cuenta atrás; una encuesta con barras en directo y un CSV del resultado; un cuestionario (archivos de preguntas JSON, texto simple o CSV, bonificación por rapidez, clasificación, un CSV de las puntuaciones, hasta cinco conjuntos guardados en el dispositivo) en el que la respuesta correcta se queda en el proyector hasta que se revela; notas adhesivas de todos los teléfonos con exportación en texto; una pizarra con un color por teléfono y exportación PNG.
- Controles del docente: bloquear o desbloquear un teléfono o todos, quitar un teléfono, pantalla completa, mantener la pantalla encendida, terminar la sesión. Un teléfono que se desconecta y vuelve recupera su nombre y su color.
- Cada dispositivo tiene su propio idioma (ocho) y su propio aspecto: claro u oscuro, alto contraste, texto grande.
- Una API de widgets y un modelo de permisos documentado (`docs/widget-api.md`, `docs/sandbox.md`): una actividad nueva es un descriptor en `data/widgets/` más un script en `widgets/`.
- Compatibilidad con teclado y lectores de pantalla, zonas táctiles grandes, diseño para pantallas estrechas de teléfono; sin rastreo, sin cuentas, funciona sin conexión.
- Instalable como aplicación y disponible sin conexión tras la primera visita cuando se sirve por HTTPS (un service worker conserva la página; no se guarda ni se envía nada más). Abierta desde un archivo descargado funciona igual, sin instalación.

## Cómo funciona

- `node scripts/build.mjs` ensambla el único `index.html` a partir de `src/` (`engine.mjs` para la lógica pura, `ui.js` para la interfaz, `sandbox.js` para el código que se ejecuta en un marco, `i18n.mjs`, `app.css`, `sandbox.css`) y de `widgets/`; `--check` verifica que la página coincide con las fuentes, incluido el hash de cada widget.
- El proyector es la autoridad: un teléfono envía peticiones, y el proyector comprueba la versión del protocolo, los nombres, los identificadores de widget, el tamaño de los mensajes, el ritmo y los permisos antes de usar nada (`docs/protocol.md`). Los votos, las respuestas y las puntuaciones se quedan en el proyector.
- Cada actividad se ejecuta en `<iframe sandbox="allow-scripts" srcdoc>`: sin origen, con la política `default-src 'none'`, un canal de mensajes privado y solo los permisos de su descriptor; la propia página no permite ninguna petición de red (`docs/sandbox.md`).
- Los teléfonos y el proyector se comunican por canales de datos WebRTC emparejados a mano (fotogramas QR o texto pegado); nada pasa por un servidor y, si no introduces un servidor STUN, ninguna petición sale de la red local.
- `npm test` comprueba el motor, los límites del protocolo, el importador de cuestionarios, los widgets, las traducciones de la interfaz y de los widgets, los archivos PWA y la documentación; la prueba en navegador del hub (`tests/proiector.test.mjs`) abre la página en navegadores Chromium reales, con conexiones WebRTC reales, un widget hostil y teléfonos hostiles. El desarrollo requiere Node.js 24 o posterior; la propia página requiere un navegador con ES2017 y canales de datos WebRTC.
- `manifest.webmanifest`, `sw.js` y los iconos los produce `node scripts/build.mjs` mediante el kit común (sección `pwa` de `src/app.json`); `--check` también los verifica, y `npm test` comprueba que el manifiesto, la versión del service worker y la CSP coincidan con la página.

## Límites

- Alfa: ningún teléfono ni tableta reales, y ningún navegador distinto de Chromium, la ha ejecutado; todo se probó en Chromium, con conexiones WebRTC reales en una sola máquina (`docs/compat.md`).
- De forma predeterminada, el emparejamiento solo funciona en la misma red local. Un servidor STUN que introduzcas podría permitirlo entre redes (no probado aquí), pero no hay relé (sin TURN), así que el Wi-Fi de invitados que aísla los dispositivos, las VPN y muchas redes escolares, corporativas y móviles aún pueden bloquearlo. Cada teléfono necesita su propio intercambio de códigos, de modo que añadir una clase entera lleva unos minutos.
- El emparejamiento muestra la dirección IP de cada dispositivo al otro (el diálogo pregunta antes). El canal está cifrado, pero la identidad del otro dispositivo no se verifica: empareja solo en tu propia sala.
- El entorno aislado no impide que una actividad hostil congele su propio marco (en algunos navegadores, toda la pestaña), y una actividad puede usar su canal privado hasta sus límites. Añade solo actividades cuyo código fuente hayas leído (`docs/sandbox.md`).
- El cuestionario lee archivos JSON, texto simple y CSV. El formato «Undava» pedido en el primer plan no se encontró documentado en ninguna parte y no se ha probado con archivos Undava reales (`docs/quiz-format.md`).
- Entre sesiones, un dispositivo conserva solo sus propios ajustes (nombre, alto contraste, texto grande) y los conjuntos de cuestionarios que elijas guardar; los resultados, las notas y los dibujos no se conservan si no los descargas. Un proyector que recarga la página termina la sesión y los teléfonos deben emparejarse de nuevo.
- Una sesión admite hasta 30 teléfonos, límite impuesto por el motor; las pruebas en navegador usaron como máximo tres conexiones reales.
- La interfaz y las actividades existen en ocho idiomas; las de francés, italiano, español, portugués, alemán y húngaro se tradujeron automáticamente y no las han revisado hablantes nativos.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/widgets/example.json` en `data/widgets/<id>.json` y edítalo (esquema en `schema.json`), y luego ejecuta `python scripts/validate.py`.
3. Escribe `widgets/<id>/index.js` (consulta `docs/widget-api.md`): `export function mount(container, api)` y `strings` en los ocho idiomas.
4. Prueba las funciones puras en `test/widgets.test.mjs`, y luego ejecuta `npm test` y `node scripts/build.mjs`.
5. Abre un pull request con el `index.html` regenerado.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
