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

  // joinExistingGameOrCreateNewGame();

  //get the initial gamestatemanager and board state from the server, using the socket
  //this should be a fresh game
  //runs a callback function so that the game is only loaded when the data is received from the server and lets me access the gameinstance from the server
  getPlayerColourAndInitialBoardState(socket, ({ gameInstance }) => {
    updateUI(
      ctx,
      gameInstance.initialBoard,
      gameInstance.initialGameStateManager
    );

    //setup eventlisteners make ui respond to player input
    //clicking on a chesspeice and then on an empty, legal square, will send json data to the server with details of the player's intended move
    setupMovementEventListeners(
      socket,
      canvas,
      gameInstance.initialBoard,
      gameInstance.initialGameStateManager,
      ctx
    );

    //update ui when a new game state object is received from server
    updateUIWithNewGameState(ctx, socket);
  });

  // disconnectFromGame();

  //find another place for this later but leave it here for now
  //this is to catch errors when the client tries to move when its not their turn
  socket.on("notYourTurn", () => {
    alert("It's not your turn!");
  });
};
