# Como contribuir — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · **Português** · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

1. Faça um fork deste repositório.
2. Copie `data/widgets/example.json` para `data/widgets/<id>.json` e edite-o (esquema em `schema.json`), e depois execute `python scripts/validate.py`.
3. Escreva `widgets/<id>/index.js` (veja `docs/widget-api.md`): `export function mount(container, api)` e `strings` nas oito línguas.
4. Teste as funções puras em `test/widgets.test.mjs` e depois execute `npm test` e `node scripts/build.mjs`.
5. Abra um pull request com o `index.html` regenerado.

## Regras

- Uma atividade = um descritor (`data/widgets/<id>.json`) + um widget (`widgets/<id>/index.js`) + testes.
- Cite sempre uma fonte.
- Contribua apenas com material que possa partilhar legalmente (sem texto protegido copiado).
- Seja gentil: veja o Código de Conduta.

## Acrescentar uma atividade

1. Adicione `data/widgets/<id>.json` (parta de `data/widgets/example.json`; esquema em `schema.json`) e execute `python scripts/validate.py`. O `id`, o nome do ficheiro, o diretório em `widgets/` e `entry` têm de coincidir. Liste o menor número possível de `permissions`: `none`, `drawing`, `storage` ou `download`; `camera` e `microphone` estão reservadas e são rejeitadas (veja `docs/sandbox.md`).
2. Escreva `widgets/<id>/index.js` como módulo ES (sintaxe ES2017, sem imports) com `export function mount(container, api)` e `export const strings` nas oito línguas (veja `docs/widget-api.md`). Sem rede, sem armazenamento do navegador, sem `parent`, sem `eval`, sem HTML construído a partir de texto: `npm test` recusa-os, e o construtor recusa `<!--`, `<script` e `</script` no código-fonte.
3. Trate toda a mensagem de um telemóvel como não fiável: verifique tipos, intervalos e comprimentos no projetor, guarde lá as respostas certas e as pontuações, e envie aos telemóveis só o de que precisam. Mudar a forma de uma mensagem ou um limite em `src/engine.mjs` implica subir `PROTO` e atualizar `docs/protocol.md` (um teste compara a sua tabela com o código).
4. Dê estilo ao widget em `widgets/<id>/style.css` com um prefixo de classes próprio e as variáveis do tema. Mantenha alvos táteis de pelo menos 44 píxeis, foco visível, uma etiqueta em cada controlo e anúncios (`api.announce`) para o que muda no ecrã; verifique o alto contraste e o texto grande.
5. Escreva testes em `test/widgets.test.mjs` para as funções puras que exportar, só com dados inventados, e execute `npm test`.
6. Execute `node scripts/build.mjs` e faça commit de `index.html`, `sw.js` e `app.json` regenerados, juntamente com `src/` e `widgets/`.
