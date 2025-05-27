import { setupMovementEventListeners } from "./src/frontend/setupEventListeners.js";
import { setupSocketWithAuthentication } from "./src/frontend/setupAuthentication.js";
import { updateUIWithNewGameState } from "./src/frontend/setupSocketListeners.js";
import { updateUI } from "./src/frontend/updateUI.js";
import { getPlayerColourAndInitialBoardState } from "./src/frontend/setupSocketListeners.js";

window.onload = () => {
  //get username and pass it as the auth object to the socket
  const socket = setupSocketWithAuthentication();

  //create a html canvas for the chess board to be drawn on, assign its 2d context to a variable
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //get the initial gamestatemanager and board state from the server, using the socket
  //this should be a fresh game
  //runs a callback function so that the game is only loaded when the data is received from the server
  getPlayerColourAndInitialBoardState(socket, () => {
    updateUI(ctx, window.initialBoard, window.initialGameStateManager);

    //setup eventlisteners make ui respond to player input
    //clicking on a chesspeice and then on an empty, legal square, will send json data to the server with details of the player's intended move
    setupMovementEventListeners(
      canvas,
      window.initialBoard,
      window.initialGameStateManager,
      ctx
    );
  });

  //update ui when a new game state object is received from server
  updateUIWithNewGameState(ctx);
};
