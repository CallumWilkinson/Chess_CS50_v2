import { setupMovementEventListeners } from "./src/frontend/setupEventListeners.js";
import { setupSocketWithAuthentication } from "./src/frontend/setupAuthentication.js";
import { updateUIWithNewGameState } from "./src/frontend/setupSocketListeners.js";
import { updateUI } from "./src/frontend/updateUI.js";
import { getPlayerColourAndInitialBoardState } from "./src/frontend/setupSocketListeners.js";
import joinExistingGameOrCreateNewChessGame, {
  joinPendingSessionFromStorage,
} from "./src/frontend/joinExistingGameOrCreateNewChessGame.js";
const PENDING_SESSION_KEY = "pendingGameSession";


/**
 * Main entry point for the chess game client
 * Sets up authentication, canvas, game connection, and UI updates
 * Runs when the window loads to initialize the entire chess game interface
 */
window.onload = () => {
  const socket = setupSocketWithAuthentication();

  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  const hasPendingSession = Boolean(
    window.sessionStorage.getItem(PENDING_SESSION_KEY)
  );

  if (hasPendingSession) {
    socket.once("connect", async () => {
      try {
        const result = await joinPendingSessionFromStorage({ socket });
        if (!result.attempted || !result.ok) {
          joinExistingGameOrCreateNewChessGame(socket);
        }
      } catch (error) {
        console.error("Failed to join pending session", error);
        joinExistingGameOrCreateNewChessGame(socket);
      }
    });
  } else {
    joinExistingGameOrCreateNewChessGame(socket);
  }

  getPlayerColourAndInitialBoardState(socket, (gameData) =>
    initializeGameUI(socket, canvas, ctx, gameData)
  );

  socket.connect();

  socket.on("notYourTurn", () => {
    alert("It's not your turn!");
  });
};

function initializeGameUI(socket, canvas, ctx, { gameInstance, playerColour }) {
  const currentGameState = {
    board: gameInstance.board,
    gameStateManager: gameInstance.gameStateManager,
    playerColour: playerColour,
  };

  updateUI(
    ctx,
    currentGameState.board,
    currentGameState.gameStateManager,
    currentGameState.playerColour
  );
  setupMovementEventListeners(socket, canvas, currentGameState);
  updateUIWithNewGameState(ctx, socket, currentGameState);
}

