import { setupMovementEventListeners } from "./src/frontend/interaction/board/setupEventListeners.js";
import { setupSocketWithAuthentication } from "./src/frontend/adapters/socket/setupAuthentication.js";
import { updateUIWithNewGameState } from "./src/frontend/adapters/socket/setupSocketListeners.js";
import { updateUI } from "./src/frontend/presentation/board/updateUI.js";
import { getPlayerColourAndInitialBoardState } from "./src/frontend/adapters/socket/setupSocketListeners.js";
const WELCOME_PATH = "welcome.html";

/**
 * Main entry point for the chess game client
 * Sets up authentication, canvas, game connection, and UI updates
 * Runs when the window loads to initialize the entire chess game interface
 */
window.onload = () => {
  const socket = setupSocketWithAuthentication();

  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session");
  if (!sessionId) {
    redirectToWelcome(window);
    return;
  }

  socket.once("connect", () => {
    try {
      socket.emit("lobby:join", { gameSessionID: sessionId }, (ack) => {
        if (ack && ack.error) {
          alert(ack.error.message || "Unable to join session");
          redirectToWelcome(window);
          return;
        }
      });
    } catch (error) {
      alert("Unable to join session");
      redirectToWelcome(window);
      return;
    }
  });

  getPlayerColourAndInitialBoardState(socket, (gameData) =>
    initializeGameUI(socket, canvas, ctx, gameData)
  );

  socket.connect();

  socket.on("notYourTurn", () => {
    alert("It's not your turn!");
  });
};

function initializeGameUI(
  socket,
  canvas,
  ctx,
  { gameInstance, playerColour, playerRoster = {}, players = [], username }
) {
  const resolvedUsername = resolveViewerUsername(socket, username);

  const currentGameState = {
    board: gameInstance.board,
    gameStateManager: gameInstance.gameStateManager,
    playerColour,
    playerRoster,
    viewerUsername: resolvedUsername,
    players,
  };

  updateUI(
    ctx,
    currentGameState.board,
    currentGameState.gameStateManager,
    currentGameState.playerColour,
    currentGameState.playerRoster,
    currentGameState.viewerUsername
  );

  setupMovementEventListeners(socket, canvas, currentGameState);
  updateUIWithNewGameState(ctx, socket, currentGameState);
}

function resolveViewerUsername(socket, reportedUsername) {
  if (
    typeof reportedUsername === "string" &&
    reportedUsername.trim().length > 0
  ) {
    return reportedUsername;
  }

  const socketAuthName = socket?.auth?.username;
  if (typeof socketAuthName === "string" && socketAuthName.trim().length > 0) {
    return socketAuthName;
  }

  return "";
}

function redirectToWelcome(win) {
  if (!win || !win.location || typeof win.location.replace !== "function") {
    return;
  }
  win.location.replace(WELCOME_PATH);
}
