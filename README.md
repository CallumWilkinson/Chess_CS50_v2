# Multiplayer Online Chess

[Play the Demo](https://multiplayer-chess-qh1o.onrender.com/)  
_(Best viewed on desktop)_

---

## How It Works

- Hosted on **Render** (free tier), with a **Node.js** backend and **Express** server.
- Multiplayer communication handled by **Socket.IO**.
- All game logic and rendering are handled **client-side** using:
  - **Vanilla JavaScript (ES6 classes)**
  - **HTML Canvas**
  - **ES Modules (`import`/`export`)**
  - **JSDoc**
  - **Jest** for unit testing
  - **Playwright** for end-to-end testing

---

## Multiplayer Notes

- Open the link in **two tabs** to test multiplayer to play against yourself.
- Due to Render’s free tier, the server may take **30+ seconds** to boot up.
- **Both players must be logged in before the first move**; otherwise, the game may desync. (Planned fix coming.)
- The **first player to connect is black**, and the **second is white**.

---

## Project Background

- Built entirely from scratch (no tutorials used) to focus on making my own **design decisions**.
- Originally created as my **final project for Harvard’s CS50**, but I’ve continued developing it to increase complexity.
- Emphasized **OOP and modularity**, prioritizing **readability over performance** where practical.
- Added **extensive comments** to document architectural decisions and enhance readability.
- Refactored the project multiple times as I learned more.
- Had **code reviews** with a senior developer friend and implemented their feedback.

---

## Technical Note

- The server's only role is to **relay moves** between clients; **all game state and logic is managed locally** on each client.
