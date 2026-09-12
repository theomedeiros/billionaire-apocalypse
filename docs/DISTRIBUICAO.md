# Distribuição: Steam, Android e iOS

Decisão proposta em 11/09/2026: preservar o núcleo JavaScript deste jogo de estratégia por turnos e validar aplicações instaláveis cedo. O site continua sendo uma prévia; não é uma versão pronta para lojas.

## Caminho recomendado

| Plataforma | Empacotamento proposto | Primeiro marco verificável |
| --- | --- | --- |
| Steam / Windows | Electron, com todos os arquivos do jogo incluídos no pacote | Executável instalado, offline, com save preservado após atualização |
| Android | Capacitor, usando os mesmos assets e regras | APK de desenvolvimento em aparelho físico; AAB para distribuição posterior |
| iPhone / iPad | Capacitor e projeto Xcode | Build instalada em aparelho e distribuição de teste pelo TestFlight |

Electron e Capacitor são propostas, ainda não foram instalados neste repositório. A próxima etapa deve ser uma prova de distribuição em Windows e Android antes de ampliar conteúdo. O código atual não usa serviços exclusivos do Sites, nem precisa de um servidor remoto para resolver turnos.

Não é necessário trocar de motor apenas para distribuir este jogo de painéis e mapas. Reavaliar um motor como Godot se o escopo mudar para animação de muitas entidades, cenários 3D ou ferramentas extensas de criação de cenas. Essa migração teria custo de interface e possivelmente das regras.

## O que preservar desde agora

- `dist/game.js` contém regras sem DOM, rede ou APIs específicas de loja. Toda plataforma deve usar esse mesmo núcleo.
- Estado serializável, sorteio por semente e testes das regras. A versão do save permite migrações; a alpha v1 migra para v2 sem zerar a partida.
- Interface adaptada a toque: informações essenciais não podem depender de hover; mapa, botões e relatórios precisam funcionar em celular físico.
- Avatares e demais imagens locais. Para a versão de produção, incluir também fontes licenciadas no pacote em vez de depender de Google Fonts.
- Separar futuramente a persistência do navegador de arquivos/app storage nativos. A implementação atual usa localStorage e não deve ser considerada o save final para distribuição.
- Serviços de plataforma (conquistas, nuvem, compras) ficam em integrações externas ao núcleo de regras. Não adicionar autenticação ou backend até existir necessidade concreta.

## Critérios de aceite antes de lojas

1. Abrir e jogar uma partida completa sem internet. Retomar após fechar, reiniciar o aparelho e atualizar o aplicativo.
2. Testar perda de foco, suspensão, áudio, teclado, toque, escalas de texto, orientação, áreas seguras e resoluções mínimas. Declarar suporte a controle/Steam Deck somente após implementar e verificar.
3. Testar desempenho e memória em Windows e celulares modestos. Gerar binários reprodutíveis, com identificador de app, ícones, versão, assinatura e ativos incluídos.
4. Usar save com escrita atômica e cópia de segurança; definir conflitos antes de implementar nuvem. Não prometer sincronização entre lojas apenas por compartilhar o código.
5. Preparar contas de desenvolvedor, página da loja, imagens, trailer, classificação e declarações exigidas sobre conteúdo, privacidade e ativos gerados por IA. Revisar exigências vigentes na data de envio.
6. Fazer distribuição de testes com usuários reais e revisar dificuldade, legibilidade e estabilidade. Aprovação nas lojas depende da revisão de cada plataforma e não pode ser garantida pelo empacotamento.

## Sequência de trabalho

1. Consolidar e testar o loop de consequências desta atualização.
2. Criar uma fatia instalável para Windows e Android com save persistente e todos os assets offline.
3. Validar em aparelhos reais; adaptar UI e armazenamento pelos problemas encontrados.
4. Adicionar iOS; integrar serviços de loja que realmente forem usados.
5. Preparar builds de teste, materiais e submissão às lojas.

## Referências oficiais consultadas

- Electron: https://www.electronjs.org/docs/latest/tutorial/distribution-overview
- Capacitor: https://capacitorjs.com/docs
- Steamworks: https://partner.steamgames.com/doc/gettingstarted/onboarding
