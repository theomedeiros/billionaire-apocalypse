# Billionaire Apocalypse

Alpha jogável de um roguelike de estratégia por turnos, baseado no GDD v0.1. Interface em português, corporate noir, para desktop e mobile.

## Executar

Requer Node.js 18 ou superior. Sem instalação de dependências.

```sh
npm run dev
```

Abra http://127.0.0.1:4173. Para validar as regras: `npm test`.

## Implementado

- Cinco arquétipos e três dificuldades.
- Dezenove operações com custos, requisitos, risco e efeitos.
- Oito regiões selecionáveis; PIB altera receita, corruptibilidade altera controle adquirido.
- Trimestres, receita passiva, um a três eventos aleatórios por turno.
- Vitória por 100% de caos; derrota por patrimônio zerado ou exposição total. Derrota tem prioridade em resultados simultâneos.
- Final temático conforme operações e atributos da partida.
- Salvamento automático e legado local: vitórias rendem três pontos para fundações (até cinco níveis).
- Interface responsiva, seleção via teclado e alertas sonoros opcionais.

## Escopo da alpha

O mapa usa regiões agregadas e contornos simplificados, não países individuais. Os cinco finais são classificações temáticas da vitória por caos, não objetivos independentes como quebrar três economias do G7. Herdeiros sucessores, arquivos secretos, cadeias de catástrofes, trilha sonora e balanceamento de produção ficam para as próximas etapas do roadmap. Estabilidade registra impacto regional; imprensa é informação regional nesta versão. A estratégia de referência dos testes verifica viabilidade, não dificuldade equilibrada.

Os dados ficam no navegador: não há conta, sincronização entre dispositivos nem backend. Fontes Google são opcionais, com fontes locais de reserva. A integração de leitura WebMCP é ativada somente em navegadores compatíveis; validação em contexto WebMCP não disponível nesta execução.

## Arquivos

`dist/game.js`: regras independentes da interface. `dist/app.js`: interface e persistência. `dist/style.css`: identidade visual. `game.test.mjs`: testes determinísticos das regras. `server.mjs`: servidor local.
