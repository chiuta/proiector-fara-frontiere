# Boas primeiras tarefas

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · **Português** · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Testar todo o percurso num iPhone real (Safari) e num telemóvel Android real (Chrome) com a lista de verificação de `docs/compat.md`, e acrescentar as suas linhas à tabela
- [ ] Experimentar o emparelhamento numa rede doméstica, num Wi-Fi escolar ou de convidados que isola os dispositivos e num ponto de acesso móvel; registar em `docs/compat.md` o que funciona e as mensagens de erro exatas
- [ ] Obter um ficheiro de questionário Undava real (ou a sua especificação publicada) e fazer com que o importador de questionários o leia, com um teste e uma nota em `docs/quiz-format.md`
- [ ] Acrescentar um widget «levantar a mão»: os telemóveis ficam em fila, o projetor mostra a ordem e deixa o professor chamar o seguinte (permissão `none`)
- [ ] Acrescentar um widget de bilhete de saída: cada telemóvel escolhe uma cara ou um número de 1 a 5 e pode juntar um comentário curto; o projetor mostra os totais e os comentários, com exportação CSV
- [ ] Acrescentar um widget para formar grupos: o projetor reparte os telemóveis ligados em grupos de um tamanho escolhido, com um botão para voltar a misturar, e cada telemóvel vê o seu grupo
- [ ] Questionário: acrescentar um segundo CSV com a resposta de cada telemóvel a cada pergunta, para o professor ver quem errou em quê
- [ ] Auditar a página com um leitor de ecrã (NVDA ou VoiceOver) e só com o teclado, corrigir o que não é anunciado ou não é alcançável e registar o resultado em `docs/compat.md`
- [ ] Rever as traduções automáticas da interface e dos widgets (fr, de, es, it, pt, hu) e corrigir o que um falante nativo não diria
- [ ] Alargar o teste no navegador do hub (`tests/proiector.test.mjs`) a dez ou mais telemóveis simulados a desenhar ao mesmo tempo e relatar o quanto o projetor continua reativo

Cria-as todas no GitHub com `scripts/create_issues.sh` (requer a CLI `gh`).
