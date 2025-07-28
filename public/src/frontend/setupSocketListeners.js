import { updateUI } from "./updateUI.js";

/**
 * Set up socket listener for initial player info and game state
 * Waits for server to send player color and initial board state, then executes callback
 * @param {Object} socket - Socket.IO client instance
 * @param {Function} callback - Callback function to execute when data is received
 */
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
 * Set up socket listener for game state updates from server
 * Updates the UI and shared game state reference when moves are processed
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Object} socket - Socket.IO client instance
 * @param {Object} currentGameState - Shared reference to current game state
 */
export function updateUIWithNewGameState(ctx, socket, currentGameState) {
  //when a SUCCESSFULL MOVE IS RECEIVED
  //extract the gamestatemanger from json object received
  if (socket) {
    socket.on("newGameState", ({ currentGameStateManager }) => {
      console.log(
        "client recived this new gamestatemanager",
        currentGameStateManager
      );
      
      //update the shared reference with the new game state
      //this ensures that event listeners always have access to the current game state
      currentGameState.board = currentGameStateManager.board;
      currentGameState.gameStateManager = currentGameStateManager;
      
      //update local UI to show the new game state
      updateUI(ctx, currentGameStateManager.board, currentGameStateManager);
    });
  }
}
