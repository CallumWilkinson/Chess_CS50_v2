import { updateUI } from "./updateUI.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 */

export function updateUIWithNewGameState(ctx) {
  //when a SUCCESSFULL MOVE IS RECEIVED
  //extract the gamestatemanger from json object received
  socket.on("new game state", ({ currentGameStateManager }) => {
    //update local UI to show the new game state
    updateUI(ctx, currentGameStateManager.board, currentGameStateManager);
  });
}

export function getPlayerColourAndInitialBoardState(socket, callback) {
  //only run if a socket connection exists
  if (socket !== "undefined") {
    //when a new player connects, set its colour to window.playerColour global variable
    socket.on(
      "playerInfo and initial board state",
      ({ username, colour, gameInstance }) => {
        console.log("Hello", username);
        console.log("You are playing as", colour);
        console.log("gameinstance:", gameInstance);
        window.playerColour = colour;
        window.initialBoard = gameInstance.board;
        window.initialGameStateManager = gameInstance.gameStateManager;

        //now that the client has actually got the data from the server, we can run the callback function
        callback();
      }
    );
  }
}
