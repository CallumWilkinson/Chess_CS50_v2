import { updateUI } from "./updateUI.js";
import { createPlayerRoster } from "./playerRoster.js";

/**
 * Set up socket listener for initial player info and game state
 * Waits for server to send player color and initial board state, then executes callback
 * @param {Object} socket - Socket.IO client instance
 * @param {Function} callback - Callback function to execute when data is received
 */
export function getPlayerColourAndInitialBoardState(socket, callback) {
  if (!socket) {
    return;
  }

  socket.on(
    "playerInfoAndInitialGameState",
    ({ username, colour, gameInstance, players }) => {
      console.log("Hello", username);
      console.log("You are playing as", colour);
      console.log("client received this initial gameinstance:", gameInstance);

      const roster = createPlayerRoster(players);

      callback({
        gameInstance,
        playerColour: colour,
        players,
        playerRoster: roster,
        username,
      });
    }
  );
}

/**
 * Set up socket listener for game state updates from server
 * Updates the UI and shared game state reference when moves are processed
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Object} socket - Socket.IO client instance
 * @param {Object} currentGameState - Shared reference to current game state
 */
export function updateUIWithNewGameState(ctx, socket, currentGameState) {
  if (!socket) {
    return;
  }

  socket.on("newGameState", ({ currentGameStateManager }) => {
    console.log(
      "client recived this new gamestatemanager",
      currentGameStateManager
    );

    currentGameState.board = currentGameStateManager.board;
    currentGameState.gameStateManager = currentGameStateManager;

    updateUI(
      ctx,
      currentGameStateManager.board,
      currentGameStateManager,
      currentGameState.playerColour,
      currentGameState.playerRoster,
      currentGameState.viewerUsername
    );
  });

  socket.on("session:players", ({ players }) => {
    if (!Array.isArray(players)) {
      return;
    }

    currentGameState.playerRoster = createPlayerRoster(players);

    if (!currentGameState.board || !currentGameState.gameStateManager) {
      return;
    }

    updateUI(
      ctx,
      currentGameState.board,
      currentGameState.gameStateManager,
      currentGameState.playerColour,
      currentGameState.playerRoster,
      currentGameState.viewerUsername
    );
  });
}
