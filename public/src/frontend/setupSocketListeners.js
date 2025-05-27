import { updateUI } from "./updateUI.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 */

export function updateUIWithNewGameState(ctx) {
  //when a SUCCESSFULL MOVE IS RECEIVED
  socket.on("new game state", (newGameState) => {
    //extract the json objects
    const { GameStateManager } = newGameState;

    //update local UI to show the new game state
    updateUI(ctx, GameStateManager.board, GameStateManager);

    return GameStateManager;
  });
}

export function getPlayerColourAndInitialBoardState(socket) {
  //only run if a socket connection exists
  if (socket !== "undefined") {
    //when a new player connects, set its colour to window.playerColour global variable
    socket.on("playerInfo and initial board state", (data) => {
      console.log("You are playing as", data.colour);
      window.playerColour = data.colour;
      return data.gameInstance.GameStateManager;
    });
  }
}
