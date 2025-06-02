import { updateUI } from "./updateUI.js";

export function getPlayerColourAndInitialBoardState(socket, callback) {
  //only run if a socket connection exists
  if (socket !== "undefined") {
    //when a new player connects, set its colour to window.playerColour global variable
    //i think this means, when browser received this event from the server, execute below
    socket.on(
      "playerInfoAndInitialGameState",
      ({ username, colour, gameInstance }) => {
        console.log("Hello", username);
        console.log("You are playing as", colour);
        console.log("client received this initial gameinstance:", gameInstance);
        window.playerColour = colour;
        window.initialBoard = gameInstance.board;
        window.initialGameStateManager = gameInstance.gameStateManager;

        //now that the client has actually got the data from the server, we can run the callback function
        callback();
      }
    );
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */

export function updateUIWithNewGameState(ctx, socket) {
  //when a SUCCESSFULL MOVE IS RECEIVED
  //extract the gamestatemanger from json object received
  if (socket !== "undefined") {
    socket.on("new game state", ({ currentGameStateManager }) => {
      console.log(
        "client recived this new gamestatemanager",
        currentGameStateManager
      );
      //update local UI to show the new game state
      updateUI(ctx, currentGameStateManager.board, currentGameStateManager);
    });
  }
}
