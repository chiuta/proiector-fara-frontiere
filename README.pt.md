# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.1.0 · Última atualização: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transforme os telemóveis da sala num ecrã partilhado via WebRTC local — sem servidor, com widgets plugin.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa: o repositório contém a estrutura, o esquema de dados ou os primeiros exemplos e os guias de contribuição. O âmbito abaixo é o plano, não o que funciona hoje.

## Âmbito previsto

- Emparelhamento sem servidor: um código QR e uma troca WebRTC oferta/resposta, para que os telemóveis se juntem sem qualquer servidor.
- Uma API de widgets (montagem/desmontagem, envio/escuta, ciclo de vida) e uma sandbox de widgets (iframe + postMessage) com um modelo de permissões documentado.
- Widgets: uma sondagem com gráfico em direto, um questionário compatível com os ficheiros de questionários Undava, notas autocolantes e um quadro branco com uma cor por telemóvel.
- Um controlo para o professor bloquear e desbloquear os telemóveis.
- Um tema de acessibilidade de alto contraste e letra grande, e testes em iOS Safari e Android Chrome registados em `docs/compat.md`.

Nada disto está ainda implementado: cada ponto é uma tarefa preparada em `ISSUES_GOOD_FIRST.md`.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/widgets/example.json` para `data/widgets/` e edite-o.
3. Execute `python scripts/validate.py`.
4. Abra um pull request — para dados não é preciso programar.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
