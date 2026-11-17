# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · **Português** · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 0.2.0 · Última atualização: 2026-11-17

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transforme os telemóveis da sala num ecrã partilhado via WebRTC local — sem servidor, com widgets plugin.

Trade-free: sem rastreamento, sem anúncios, sem contas, funciona offline.

## Estado

Alfa, utilizável: a página do projetor e cinco atividades (temporizador, sondagem, questionário, notas autocolantes, quadro) funcionam no único ficheiro `index.html`: abra-o no dispositivo do professor, adicione telemóveis com um código QR ou de texto, sem servidor e sem conta. As atividades correm em quadros isolados. O que não foi testado (telemóveis reais, navegadores que não o Chromium, Wi-Fi real) está listado abaixo e em `docs/compat.md`.

## O que faz

- Dois papéis numa só página: no projetor (mostra o ecrã partilhado e dirige as atividades) e como telemóvel (junta-se e participa). Uma sessão aceita até 30 telemóveis.
- Emparelhamento sem servidor: cada telemóvel emparelha com o projetor trocando um código, como imagens QR, fotografia do código ou texto colado; sem conta, sem servidor de sinalização, sem rastreamento. Por omissão, nada sai da rede local.
- Cinco atividades: um temporizador de contagem decrescente; uma sondagem com barras em direto e um CSV do resultado; um questionário (ficheiros de perguntas JSON, texto simples ou CSV, bónus de rapidez, classificação, um CSV das pontuações, até cinco conjuntos guardados no dispositivo) em que a resposta certa fica no projetor até ser revelada; notas autocolantes de todos os telemóveis com exportação em texto; um quadro branco com uma cor por telemóvel e exportação PNG.
- Controlos do professor: bloquear ou desbloquear um telemóvel ou todos, remover um telemóvel, ecrã inteiro, manter o ecrã ligado, terminar a sessão. Um telemóvel que sai e volta recupera o nome e a cor.
- Cada dispositivo tem a sua própria língua (oito) e o seu próprio aspeto: claro ou escuro, alto contraste, texto grande.
- Uma API de widgets e um modelo de permissões documentado (`docs/widget-api.md`, `docs/sandbox.md`): uma atividade nova é um descritor em `data/widgets/` mais um script em `widgets/`.
- Suporte para teclado e leitores de ecrã, alvos táteis grandes, disposição para ecrãs estreitos de telemóvel; sem rastreamento, sem contas, funciona offline.
- Instalável como aplicação e disponível offline após a primeira visita quando servida por HTTPS (um service worker guarda a página; nada mais é guardado ou enviado). Aberta a partir de um ficheiro descarregado funciona da mesma forma, sem instalação.

## Como funciona

- `node scripts/build.mjs` monta o único `index.html` a partir de `src/` (`engine.mjs` para a lógica pura, `ui.js` para a interface, `sandbox.js` para o código que corre num quadro, `i18n.mjs`, `app.css`, `sandbox.css`) e de `widgets/`; `--check` verifica que a página corresponde às fontes, incluindo o hash de cada widget.
- O projetor é a autoridade: um telemóvel envia pedidos, e o projetor verifica a versão do protocolo, os nomes, os identificadores de widget, o tamanho das mensagens, o ritmo e as permissões antes de usar seja o que for (`docs/protocol.md`). Votos, respostas e pontuações ficam no projetor.
- Cada atividade corre em `<iframe sandbox="allow-scripts" srcdoc>`: sem origem, com a política `default-src 'none'`, um canal de mensagens privado e só as permissões do seu descritor; a própria página não permite qualquer pedido de rede (`docs/sandbox.md`).
- Os telemóveis e o projetor comunicam por canais de dados WebRTC emparelhados à mão (imagens QR ou texto colado); nada passa por um servidor e, se não introduzir um servidor STUN, nenhum pedido sai da rede local.
- `npm test` verifica o motor, os limites do protocolo, o importador de questionários, os widgets, as traduções da interface e dos widgets, os ficheiros PWA e a documentação; o teste no navegador do hub (`tests/proiector.test.mjs`) abre a página em navegadores Chromium reais, com ligações WebRTC reais, um widget hostil e telemóveis hostis. O desenvolvimento exige Node.js 24 ou mais recente; a própria página exige um navegador com ES2017 e canais de dados WebRTC.
- `manifest.webmanifest`, `sw.js` e os ícones são produzidos por `node scripts/build.mjs` através do kit comum (secção `pwa` de `src/app.json`); `--check` também os verifica, e `npm test` confirma que o manifesto, a versão do service worker e a CSP correspondem à página.

## Limites

- Alfa: nenhum telemóvel ou tablet real, e nenhum navegador que não o Chromium, a executou; tudo foi testado no Chromium, com ligações WebRTC reais numa só máquina (`docs/compat.md`).
- Por predefinição, o emparelhamento só funciona na mesma rede local. Um servidor STUN que introduza poderá permiti-lo entre redes (não experimentado aqui), mas não há retransmissão (sem TURN), por isso o Wi-Fi de convidados que isola os dispositivos, as VPN e muitas redes escolares, empresariais e móveis ainda o podem bloquear. Cada telemóvel precisa da sua própria troca de códigos, pelo que juntar uma turma inteira leva alguns minutos.
- O emparelhamento mostra o endereço IP de cada dispositivo ao outro (a caixa de diálogo pergunta primeiro). O canal é cifrado, mas a identidade do outro dispositivo não é verificada: emparelhe apenas na sua própria sala.
- A sandbox não impede que uma atividade hostil congele o seu próprio quadro (em alguns navegadores, o separador inteiro), e uma atividade pode usar o seu canal privado até aos seus limites. Adicione apenas atividades cujo código-fonte tenha lido (`docs/sandbox.md`).
- O questionário lê ficheiros JSON, texto simples e CSV. O formato «Undava» pedido no primeiro plano não foi encontrado documentado em lado nenhum e não foi testado com ficheiros Undava reais (`docs/quiz-format.md`).
- Entre sessões, um dispositivo guarda apenas as suas próprias definições (nome, alto contraste, texto grande) e os conjuntos de questionários que escolher guardar; os resultados, as notas e os desenhos não são guardados se não os descarregar. Um projetor que recarrega a página termina a sessão e os telemóveis têm de ser emparelhados de novo.
- Uma sessão aceita até 30 telemóveis, limite imposto pelo motor; os testes no navegador usaram, no máximo, três ligações reais.
- A interface e as atividades existem em oito línguas; as de francês, italiano, espanhol, português, alemão e húngaro foram traduzidas automaticamente e não foram revistas por falantes nativos.

## Contribua em 5 minutos

1. Faça um fork deste repositório.
2. Copie `data/widgets/example.json` para `data/widgets/<id>.json` e edite-o (esquema em `schema.json`), e depois execute `python scripts/validate.py`.
3. Escreva `widgets/<id>/index.js` (veja `docs/widget-api.md`): `export function mount(container, api)` e `strings` nas oito línguas.
4. Teste as funções puras em `test/widgets.test.mjs` e depois execute `npm test` e `node scripts/build.mjs`.
5. Abra um pull request com o `index.html` regenerado.

## Boas primeiras tarefas

Veja `ISSUES_GOOD_FIRST.md` para tarefas prontas.

## Licença

Código: MIT. Dados contribuídos: indique a fonte; são publicados sob a mesma licença, salvo indicação em contrário.

## Apoio

Se o projeto lhe for útil, pode [oferecer-me um café](https://buymeacoffee.com/echo.of.the.strings).
