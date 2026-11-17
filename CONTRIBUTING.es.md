# Cómo contribuir — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · **Español** · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versión: 0.2.0 · Última actualización: 2026-11-17

1. Haz un fork de este repositorio.
2. Copia `data/widgets/example.json` en `data/widgets/<id>.json` y edítalo (esquema en `schema.json`), y luego ejecuta `python scripts/validate.py`.
3. Escribe `widgets/<id>/index.js` (consulta `docs/widget-api.md`): `export function mount(container, api)` y `strings` en los ocho idiomas.
4. Prueba las funciones puras en `test/widgets.test.mjs`, y luego ejecuta `npm test` y `node scripts/build.mjs`.
5. Abre un pull request con el `index.html` regenerado.

## Reglas

- Una actividad = un descriptor (`data/widgets/<id>.json`) + un widget (`widgets/<id>/index.js`) + pruebas.
- Cita siempre una fuente.
- Aporta solo material que puedas compartir legalmente (sin texto protegido copiado).
- Sé amable: consulta el Código de conducta.

## Añadir una actividad

1. Añade `data/widgets/<id>.json` (parte de `data/widgets/example.json`; esquema en `schema.json`) y ejecuta `python scripts/validate.py`. El `id`, el nombre del archivo, el directorio bajo `widgets/` y `entry` deben coincidir. Lista los menos `permissions` posibles: `none`, `drawing`, `storage` o `download`; `camera` y `microphone` están reservados y se rechazan (consulta `docs/sandbox.md`).
2. Escribe `widgets/<id>/index.js` como módulo ES (sintaxis ES2017, sin imports) con `export function mount(container, api)` y `export const strings` en los ocho idiomas (consulta `docs/widget-api.md`). Sin red, sin almacenamiento del navegador, sin `parent`, sin `eval`, sin HTML construido a partir de texto: `npm test` los rechaza, y el constructor rechaza `<!--`, `<script` y `</script` en el código fuente.
3. Trata todo mensaje de un teléfono como no fiable: comprueba tipos, rangos y longitudes en el proyector, guarda allí las respuestas correctas y las puntuaciones, y envía a los teléfonos solo lo que necesitan. Cambiar la forma de un mensaje o un límite en `src/engine.mjs` implica subir `PROTO` y actualizar `docs/protocol.md` (una prueba compara su tabla con el código).
4. Da estilo al widget en `widgets/<id>/style.css` con un prefijo de clases propio y las variables del tema. Mantén zonas táctiles de al menos 44 píxeles, un foco visible, una etiqueta en cada control y anuncios (`api.announce`) para lo que cambie en pantalla; comprueba el alto contraste y el texto grande.
5. Escribe pruebas en `test/widgets.test.mjs` para las funciones puras que exportes, solo con datos inventados, y ejecuta `npm test`.
6. Ejecuta `node scripts/build.mjs` y haz commit de `index.html`, `sw.js` y `app.json` regenerados junto con `src/` y `widgets/`.
