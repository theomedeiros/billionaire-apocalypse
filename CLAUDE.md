# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Billionaire Apocalypse" — a turn-based strategy roguelike, playable in the browser, **in Brazilian Portuguese**. All user-facing strings, comments in the README, and design docs are in pt-BR; keep new UI text in Portuguese. It's a local web demo: no build step, no framework, no runtime dependencies (Node stdlib only).

## Commands

```sh
npm run dev    # serves dist/ at http://127.0.0.1:4173/
npm test       # node --test *.test.mjs (game.test.mjs + tutorial.test.mjs)
```

Run a single test by name:

```sh
node --test --test-name-pattern="falência e exposição" *.test.mjs
```

## Architecture

The whole app lives in `dist/` and is served as static files by `server.mjs` (a ~1-line Node http server with a path-traversal guard). There is no compilation — `dist/*.js` are the actual source you edit, not build output. `dist/index.html` mounts everything into `#app` and loads `app.js` as an ES module.

Two-layer split, and it's strict:

- **`dist/game.js` — the engine.** Pure game logic and all data (archetypes, regions, operations, jokers, opponents, businesses, dilemmas, regional events). State `s` is a plain object; every function takes `s` and returns/mutates it. No DOM, no `localStorage`, no I/O here. This is what the tests import directly. Key entry points: `newGame`/`restoreGame` (state lifecycle), `chooseOption` (the card-draft entry point — see below), `execute`/`endTurn` (underlying turn primitives), `outcome`/`regionalEnding` (win/loss + endings), `respond`/`resolveDilemma`/`recover` (pending-decision resolution), `blocked`/`*Blocked` (return a pt-BR reason string, or `''` when allowed).
- **`dist/app.js` — the UI.** Imports everything from `game.js`, renders the entire screen by string-templating `innerHTML` on each `render()`, and wires events via delegation. Owns all side effects: `localStorage` (`save`/`read`), audio, modals (`openModal` on the `<dialog id="modal">`). Functions here return HTML strings (`map()`, `metric()`, `command()`, etc.).

Supporting modules imported by `app.js`: `dist/tutorial.js` (skippable intro, gates on its own localStorage key) and `dist/operation-stories.js` (flavor text data).

### Turn flow — the card draft

A quarter is three months, and each month the player is dealt **3 drafted options** (`s.options`) and must pick exactly one — there is no free action picking. This layer is **additive on top of `execute`/`endTurn`**, so those primitives (and their tests) are unchanged.

- `rollOptions(s)` refills `s.options` by sampling `draftPool(s)` (available operations + unowned jokers + asset/ally/rush decisions, padded with `pass`) via seeded `random(s)`. It's called on `newGame`, `restoreGame` (if mid-run with empty options), after each pick, after `endTurn`, and after `resolveDilemma`.
- `chooseOption(s, idx)` is the single entry point the UI calls. It routes to `execute`/`acquireJoker`/`useAsset`/`supportAlly`/`rushProject`/`passMonth`, then auto-advances: rerolls, or calls `endTurn` when the 3rd action closes the quarter, or clears `options` if the run ended. `optionInfo(s, choice)` / `optionBlocked(s, idx)` describe a card for rendering.
- **Jokers** are permanent passive multipliers bought as cards (`jokerDefs`, cap `maxJokers`). `jokerMultiplier(s, key, category)` stacks all owned jokers' `mods` for a given effect key + operation category; `effectiveCost(s, o)` and `execute` apply these so joker combos compound over a run. New state fields backing all this: `s.jokers` and `s.options`.

### Conventions that matter

- **Blocking pattern:** gating functions (`blocked`, `assetBlocked`, `rushBlocked`, `allyBlocked`, `responseBlocked`, `recoveryBlocked`, `dilemmaBlocked`) return a human-readable pt-BR reason when an action is disallowed and `''` when it's allowed. The UI shows the reason; the engine trusts these before mutating.
- **Determinism:** randomness goes through `random(s)` (seeded LCG on `s.seed`) so runs and tests are reproducible. Don't call `Math.random()` in the engine.
- **One region per run:** a run is locked to `s.territory`; operations/assets/allies in other regions are intentionally blocked. Regional differences live in `regionalRules` + `regionalEvents` keyed by territory index.
- **Delayed consequences:** actions queue into `s.pending` (kinds: `impact`, `project`, threats/responses) and land on later `endTurn`s. Dilemmas (`s.dilemma`) must be resolved before the next quarter closes.

### Domain quick-reference

- **Archetypes** (`s.archetype`): `visionario` (A Visionária — projects/early launch) and `oligarca` (O Oligarca — alliances/loyalty). `newGame(archetype, territory)`.
- **Territories** (`s.territory`, index into `regions`): `0` América do Sul, `1` Europa Ocidental, `2` Sudeste Asiático.
- **Avatar coupling:** `app.js` builds `avatars/${a.id}.png`, so adding an archetype requires a matching PNG in `dist/avatars/` or the avatar image 404s.
- **End conditions:** chaos reaching 100% ends the run (regional ending). Bankruptcy ($0B), exposure ≥ 100, or investigation ≥ 100 lose — and a loss takes priority over a simultaneous win in the same close.

### Persistence

Browser `localStorage` only — no accounts, no server state, no telemetry. Current keys: `ba-regional-run`, `ba-regional-record`, `ba-regional-tutorial-done`. Legacy `ba-demo-*` keys from an older prototype are deliberately left untouched and **not** migrated; don't add silent conversion.

## Tests

`game.test.mjs` covers the engine (limits, opponents, businesses, projects, allies, secrets, dilemmas, save/restore, regional endings) and includes automated win-path strategies for both archetypes — a passive "wait it out" run must lose. `tutorial.test.mjs` covers the tutorial cycle. Tests import from `dist/game.js` directly, so keep engine logic DOM-free or you'll break them.

## Docs

`docs/DISTRIBUICAO.md` (distribution planning) and `docs/TESTE-DEMO.md` (playtest script) — both pt-BR, both planning notes rather than build instructions. Native packaging (Steam/Android/iOS) is explicitly out of scope; this is a local web demo.
