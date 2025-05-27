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

  //getplayer colour
  const initialGameStateManager = getPlayerColourAndInitialBoardState(socket);
  updateUI(ctx, initialGameStateManager.board, initialGameStateManager);

  //setup eventlisteners make ui respond to player input
  //clicking on a chesspeice and then on an empty, legal square, will run the gameStateManager.makeMove() function to update board state, switch turns and update UI
  setupMovementEventListeners(
    canvas,
    initialGameStateManager.board,
    initialGameStateManager,
    ctx
  );

  //update ui when new game state is received from server
  updateUIWithNewGameState(ctx);
};
