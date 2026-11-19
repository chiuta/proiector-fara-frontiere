# Registo de alterações

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · **Português** · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Não lançado]

## [0.2.1] - 2026-11-20

### Alterado
- fff-kit 1.8.1: quando o navegador bloqueia o armazenamento ou não o tem (`localStorage`/`sessionStorage` lançam um erro ou não existem), a página arranca com um armazenamento temporário em memória em vez de parar; os dados não são mantidos depois de fechar a página.
- fff-kit 1.8.1: o guia que aumenta os controlos pequenos para 44 px mede agora também a largura do corpo da página e do elemento pai, pelo que uma fila de botões já não pode sair do ecrã (o grupo fica intacto quando o aumento o tornaria demasiado largo).

## [0.2.0] - 2026-11-17

### Adicionado
- A página do projetor e do telemóvel: um único `index.html`, construído a partir de `src/` e `widgets/` por `node scripts/build.mjs` (`--check` verifica-o), com o ecrã partilhado, os controlos e a vista do telemóvel no mesmo ficheiro.
- Emparelhamento sem servidor por troca de códigos (imagens QR, fotografia do código ou texto colado), até 30 telemóveis por sessão; controlos do professor para bloquear ou desbloquear, retirar um telemóvel, passar a ecrã inteiro, manter o ecrã ligado e terminar a sessão.
- Cinco atividades: temporizador, sondagem, questionário, notas autocolantes e quadro branco, com exportações CSV, texto e PNG onde se aplicam.
- A API de widgets e o isolamento de cada atividade num quadro em sandbox, com as permissões `none`, `drawing`, `storage` e `download` (`camera` e `microphone` estão reservadas e são recusadas): `docs/widget-api.md` e `docs/sandbox.md`.
- O protocolo projetor–telemóvel com os seus limites (telemóveis, nomes, tamanho das mensagens, ritmo, dados guardados), uma sessão que se ressincroniza quando volta uma ligação fraca e exportações CSV que neutralizam as células que começam por um caráter de fórmula: `docs/protocol.md`.
- Ficheiros de questionário em JSON, texto simples ou CSV, lidos por um importador tolerante e documentados em inglês e romeno em `docs/quiz-format.md`; o formato «Undava» não é afirmado, porque não se encontrou nenhuma especificação.
- Oito línguas para a interface e as atividades, uma língua e um aspeto (claro, escuro, alto contraste, texto grande) escolhidos em cada dispositivo, e suporte para teclado e leitores de ecrã.
- Testes: `npm test` (motor, limites do protocolo, importador de questionários, widgets, traduções, ficheiros PWA, compilação e documentação), um teste no navegador no hub com ligações WebRTC reais, um widget hostil e telemóveis hostis, e `docs/compat.md` com uma lista de verificação para dispositivos reais.
- README, CHANGELOG, CONTRIBUTING e ISSUES_GOOD_FIRST reescritos para esta versão em oito línguas, com dez tarefas para começar.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT traduzidos para as oito línguas.
- README em inglês, romeno, francês, italiano, espanhol, português, alemão e húngaro: secções de estado e de âmbito previsto (derivadas de `ISSUES_GOOD_FIRST.md`).
- Instalável (PWA): `manifest.webmanifest`, `sw.js` e os ícones são gerados pelo kit comum (`fff-kit/pwa`); a página funciona offline após a primeira visita por HTTPS.

### Alterado
- `data/widgets/example.json` é agora um descritor modelo (`my-widget`, com traduções em oito línguas); o descritor do temporizador passou para `data/widgets/timer.json`, ao lado de `poll`, `quiz`, `notes` e `whiteboard`.
- `widgets/timer/index.js` é agora o temporizador real e já não o exemplo de demonstração.
- `schema.json`: `description` e `i18n` são obrigatórios (o inglês é obrigatório, as outras sete línguas são assinaladas pelo validador), `id` e `entry` têm de seguir uma forma fixa, e `permissions` aceita de um a três valores entre `none`, `drawing`, `storage` e `download`; `camera` e `microphone` já não são aceites.
- `scripts/validate.py` verifica também que `id` é igual ao nome do ficheiro, que `entry` existe e exporta `mount`, que as permissões reservadas são recusadas com uma mensagem clara e que as traduções estão completas (um aviso, ou um erro com `--strict`).
- O workflow corre em Ubuntu 26.04 com Node.js 26 e executa também os testes e a verificação da compilação.

## [0.1.0] - 2026-11-13

### Adicionado
- Esqueleto inicial: estrutura, esquema de dados ou primeiros exemplos, guias de contribuição em oito línguas.
