# Billionaire Apocalypse — demo

Jogo de estratégia por turnos em português. Escolha uma região no começo da run e alcance 100% de caos local antes de falir, chegar a 100% de exposição ou de investigação.

## Recorte atual

- Dois perfis: A Visionária (projetos e lançamento antecipado) e O Oligarca (alianças, lealdade e compromissos).
- Três regiões iniciais: América do Sul, Europa Ocidental e Sudeste Asiático. Cada run fica restrita à região escolhida e a demo termina no seu desfecho.
- Treze operações comuns e um segredo exclusivo de cada região, descoberto por pistas qualitativas.
- Três negócios adquiríveis: energia, mídia e dados, com duas alternativas de uso e uma utilização por trimestre.
- Dois adversários visíveis: Helena Duarte prepara reportagens; o Pacto de Estabilidade prepara sanções. Cada ameaça mostra origem, região, prazo e decisões de resposta.
- Três ações por trimestre. Consequências atrasadas, manutenção crescente, suspensão de receitas e possível perda de concessão.
- Tutorial pulável, dossiês e relatório trimestral. Sem bônus permanentes entre partidas na demo.

## Executar

Node.js instalado, sem dependências adicionais:

```sh
npm run dev
```

Acesse http://127.0.0.1:4173/. Os arquivos de `dist/` são a aplicação estática, sem etapa de build.

```sh
npm test
```

Os testes cobrem o motor, limites, adversários, negócios, projetos, aliados, segredos, salvamento e ciclo do tutorial. Uma estratégia automatizada verifica caminhos de vitória para os dois perfis; esperar passivamente resulta em derrota. Isso não demonstra equilíbrio comercial ou diversão.

## Salvamento

A demo usa `ba-regional-run`, `ba-regional-record` e `ba-regional-tutorial-done` no navegador. As chaves do protótipo anterior não são apagadas. Saves anteriores não são convertidos para a campanha regional. Não há conta, sincronização ou telemetria externa.

## Teste com jogadores

Consulte `docs/TESTE-DEMO.md`. A duração de 15–25 minutos é uma hipótese a medir. Esta entrega é uma demo web local; empacotamento e validação nativa para Steam, Android e iOS continuam fora deste recorte. Veja `docs/DISTRIBUICAO.md` para o planejamento de distribuição.

## Finais regionais

Ao atingir 100% de caos, o jogo registra as condições da região e encerra a demo:

- Controle político em 100%: guerra civil; entre 70% e 99%: rebelião armada.
- Fragilidade digital a partir de 70%: colapso tecnológico, com bancos e serviços paralisados.
- Pressão sanitária a partir de 70%: pandemia sem contenção.
- Duas ou três condições simultâneas: final combinado, descrevendo cada crise.
- Nenhuma condição em 70%: ruptura da ordem regional.

Capacidade tecnológica do grupo desbloqueia operações; fragilidade digital é um indicador regional separado. Pressão sanitária representa deterioração da saúde. Os indicadores respondem a operações, dilemas, eventos regionais e contramedidas. A passagem de tempo, sozinha, não produz uma vitória. Derrota financeira, exposição ou investigação prevalecem mesmo se o caos atingir 100% no mesmo fechamento.

As chaves antigas `ba-demo-*` também permanecem intactas. Os testes simulam os caminhos sanitário e digital em todas as regiões e perfis, além de verificar fronteiras e combinações dos finais. A fiscalização foi recalibrada para uma campanha concentrada em um território.

## Decisões e recuperação

- O Pacto escolhe a crise dominante a partir de 40% ao preparar uma nova medida. Fiscalização eleitoral, descentralização digital e atendimento emergencial afetam o respectivo indicador. Aceitar a reforma cancela a medida, preserva o negócio e exige recuar na crise e no caos. A ameaça mantém a modalidade anunciada até sua resolução.
- Após uma consequência, o adversário leva dois trimestres para preparar outra medida. Isso cria espaço para reagir ao resultado.
- Há nove dilemas: três por caminho. Os marcos de crise são 30/55/80%, acompanhados de caos em 20/40/60%. Um dilema aparece por fechamento; cada um acontece uma vez. Financiar uma resposta custa recursos e reduz a crise; manter o plano preserva caixa e aumenta exposição/investigação. Não consomem ação, mas precisam ser resolvidos antes de outro fechamento. Sempre existe uma escolha sem custo financeiro.
- A saída de emergência surge antes da derrota, com patrimônio até $4B ou exposição/investigação a partir de 75%. Uma vez por run, sem ação: vender o negócio por $5B e perder renda, ou ceder 20% de controle e influência local por recursos e proteção. A segunda opção exige esses dois valores e cancela a medida atual do Pacto.
- O painel mostra influência local, usada nas negociações e na recuperação. A estabilidade foi retirada da interface por não oferecer uma decisão direta. Pressão afeta eficácia e fiscalização; mídia protege contra reportagens; capacidade tecnológica desbloqueia operações.
- Saves regionais existentes recebem os novos campos ao carregar, preservando progresso e consequências anteriores.

## Refinamento para o teste público

- Dilemas políticos permitem gastar 15 de influência local; digitais, sacrificar 15 de capacidade tecnológica; sanitários, comprometer $0,3B de receita-base por trimestre. Os custos exigem recursos disponíveis, e compromissos de receita preservam ao menos $0,5B de receita-base. Essas alternativas convivem com a resposta financiada e a opção de assumir exposição.
- América do Sul: +25% de influência local obtida com acordos políticos; aliados perdem 4 de lealdade por trimestre. Europa Ocidental: reportagens geram +2 pontos de investigação; defesa jurídica reduz 25 pontos. Sudeste Asiático: +25% de fragilidade digital gerada; manutenção adicional de $0,15B ao atingir 40%.
- Cada região tem dois eventos próprios, em 30% e 65% de caos. Não se repetem e têm prioridade sobre um dilema genérico naquele fechamento. Acontece apenas uma decisão pendente por vez.
- O relatório começa com consequências concluídas, medidas anunciadas e oportunidades. Os números vêm depois; o histórico completo fica em uma seção expansível. O relatório preserva o retrato do fechamento em que foi criado.
- O encerramento apresenta até três decisões distintas selecionadas pelo impacto registrado, além da situação do negócio e do aliado. As escolhas passam a ser registradas nesta atualização; não se inventa um histórico para saves anteriores.

Validação desta revisão: 27 testes automatizados e uma campanha sanitária concluída pela interface, incluindo evento regional, compromisso de receita, relatório e final personalizado. A duração e o equilíbrio ainda precisam ser medidos com jogadores. A entrega continua sendo web; não foi publicada automaticamente nem empacotada como aplicativo nativo.
