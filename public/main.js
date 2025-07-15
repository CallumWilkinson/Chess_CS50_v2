import { setupMovementEventListeners } from "./src/frontend/setupEventListeners.js";
import { setupSocketWithAuthentication } from "./src/frontend/setupAuthentication.js";
import { updateUIWithNewGameState } from "./src/frontend/setupSocketListeners.js";
import { updateUI } from "./src/frontend/updateUI.js";
import { getPlayerColourAndInitialBoardState } from "./src/frontend/setupSocketListeners.js";
import joinExistingGameOrCreateNewChessGame from "./src/frontend/joinExistingGameOrCreateNewChessGame.js";

window.onload = () => {
  //get username and pass it as the auth object to the socket
  const socket = setupSocketWithAuthentication();

  //create a html canvas for the chess board to be drawn on, assign its 2d context to a variable
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //this function runs on window load
  //eventually i will add some more ui so that on window load you will get a list of available games to join
  //and a button to create a new game
  //but for now i just want to create a new game if there is none already, and if there is already a game made then join it
  joinExistingGameOrCreateNewChessGame(socket);

  //get the initial gamestatemanager and board state from the server, using the socket
  //this should be a fresh game
  //runs a callback function so that the game is only loaded when the data is received from the server and lets me access the gameinstance from the server
  getPlayerColourAndInitialBoardState(socket, ({ gameInstance }) => {
    //create a shared reference object that will hold the current game state
    //this allows the event listeners to always access the most up-to-date game state
    const currentGameState = {
      board: gameInstance.board,
      gameStateManager: gameInstance.gameStateManager
    };

    updateUI(ctx, currentGameState.board, currentGameState.gameStateManager);

    //setup eventlisteners make ui respond to player input
    //clicking on a chesspeice and then on an empty, legal square, will send json data to the server with details of the player's intended move
    setupMovementEventListeners(
      socket,
      canvas,
      currentGameState
    );

    //update ui when a new game state object is received from server
    //pass the currentGameState reference so it can be updated when new states arrive
    updateUIWithNewGameState(ctx, socket, currentGameState);
  });

  //manually connect to the socket after all socket listeners have been registered
  //this ensures everything above is actually loaded first
  //i have turned autoconnect off in the setupAuthentication.js file
  socket.connect();

  // disconnectFromGame();

  //find another place for this later but leave it here for now
  //this is to catch errors when the client tries to move when its not their turn
  socket.on("notYourTurn", () => {
    alert("It's not your turn!");
  });
};
