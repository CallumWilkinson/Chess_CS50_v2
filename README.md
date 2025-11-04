# Multiplayer Chess Platform (Portfolio Build)

This is my personal exploration of a server-authoritative multiplayer architecture for turn-based games. Chess is the flagship experience, and the platform is designed so I can layer in additional titles without rewriting networking or game rules.

## About the Current Demo

- **Hosted preview:** https://multiplayer-chess-qh1o.onrender.com/  
  This is the `main` branch build—a lightweight, client-only multiplayer experience that demonstrates the interface and flow while the full backend settles.
- IMPORTANT: as this is hosted on the free tier on render, please allow approx. 30 sec for the project to boot up, please ignore the loading screen.
  In addition, to test this version you must open two tabs to play against yourself, as there is no lobby based networking in this version, the game will connect players automatically in the order that they connect. You also cannot move a chess peice untill both players have joined otherwise the clients will be out of sync

## Server-Side Refactor Progress

- The `server-side-refactor` branch introduces the production-ready backend with Socket.IO orchestration, rich session lifecycle management, and domain-first chess logic.
- That branch is nearly complete; I use it locally today to simulate real games while I finalise deployment hardening.
- This refactor fixes all the limitations of the client side version listed above

## Try It Locally

```bash
npm install
npm start
```

Open two browser tabs at `http://localhost:3000` and play against yourself to see server arbitration, move validation, and game state tracking in action.

### Environment Targets

- Node.js 20+
- Modern desktop browser

## Tech Snapshot

- Real-time WebSocket play with server authority (`backend/gameSetup`).
- Game engine built from small ES6 classes (`core/gameLogic`, `core/chessPieces`).
- Shared utilities for coordinates and constants in `shared/utilities`.
- Static frontend assets in `public`, wired directly to the Socket.IO client.
- Tests aligned with a red-green-refactor flow, using Jest for unit/integration coverage and reserving Playwright for future end-to-end passes.

```bash
npm test
```

## What’s Next

- Deploy the refactored backend to Fly.io so the full multiplayer loop is available without cloning the repo.
- Add match history and richer lobby tooling once server hosting is stable.
- Expand the rules engine to support checkers as the next proof-of-flexibility.

Until the Fly.io deployment goes live, the hosted demo showcases the UI, and the full experience is ready by running locally from the `server-side-refactor` branch.
