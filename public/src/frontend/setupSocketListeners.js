import { updateUI } from "./updateUI.js";

export function getPlayerColourAndInitialBoardState(socket, callback) {
  //only run if a socket connection exists
  if (socket) {
    //when a new player connects, set its colour to window.playerColour global variable
    //i think this means, when browser received this event from the server, execute below
    socket.on(
      "playerInfoAndInitialGameState",
      ({ username, colour, gameInstance }) => {
        console.log("Hello", username);
        console.log("You are playing as", colour);
        console.log("client received this initial gameinstance:", gameInstance);
        //i could probably return the colour in the callback so i dont need to assign to a window, but leave this for now
        window.playerColour = colour;

        //now that the client has actually got the data from the server, we can run the callback function
        //pass the data to the callback so i dont need to use window.gameinstance ect as global variables, this is jsut a bit neater
        callback({ gameInstance });
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
  if (socket) {
    socket.on("newGameState", ({ currentGameStateManager }) => {
      console.log(
        "client recived this new gamestatemanager",
        currentGameStateManager
      );
      //update local UI to show the new game state
      updateUI(ctx, currentGameStateManager.board, currentGameStateManager);
    });
  }
}
