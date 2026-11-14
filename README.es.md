# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · **Español** · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versión: 0.1.0 · Última actualización: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Convierte los teléfonos del aula en una pantalla compartida con WebRTC local — sin servidor, con widgets plugin.

Trade-free: sin rastreo, sin anuncios, sin cuentas, funciona sin conexión.

## Estado

Alfa: el repositorio contiene la estructura, el esquema de datos o los primeros ejemplos y las guías de contribución. El alcance de abajo es el plan, no lo que funciona hoy.

## Alcance previsto

- Emparejamiento sin servidor: un código QR y un intercambio WebRTC oferta/respuesta, para que los teléfonos se unan sin ningún servidor.
- Una API de widgets (montaje/desmontaje, envío/escucha, ciclo de vida) y un entorno aislado para widgets (iframe + postMessage) con un modelo de permisos documentado.
- Widgets: una encuesta con gráfico en directo, un cuestionario compatible con los archivos de cuestionarios Undava, notas adhesivas y una pizarra con un color por teléfono.
- Un control para el profesorado que bloquea y desbloquea los teléfonos.
- Un tema de accesibilidad de alto contraste y letra grande, y pruebas en iOS Safari y Android Chrome registradas en `docs/compat.md`.

Nada de esto está implementado todavía: cada punto es una tarea preparada en `ISSUES_GOOD_FIRST.md`.

## Contribuye en 5 minutos

1. Haz un fork de este repositorio.
2. Copia `data/widgets/example.json` en `data/widgets/` y edítalo.
3. Ejecuta `python scripts/validate.py`.
4. Abre un pull request: para los datos no hace falta programar.

## Buenas primeras tareas

Consulta `ISSUES_GOOD_FIRST.md` para tareas ya preparadas.

## Licencia

Código: MIT. Datos aportados: indica la fuente; se publican con la misma licencia salvo que el archivo diga otra cosa.

## Apoyo

Si el proyecto te resulta útil, puedes [invitarme a un café](https://buymeacoffee.com/echo.of.the.strings).
