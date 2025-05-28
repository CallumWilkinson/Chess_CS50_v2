import { getNewGameState } from "../gameLogic/getNewGameState.js";

export function handleMove(socket, jsonMoveData, players, gameInstance) {
  //check if the move is from the current player
  const currentPlayerColour =
    gameInstance.gameStateManager.turnManager.currentPlayerColour;

  //send error to client if player tried to move when its not their turn
  if (players[socket.id].colour !== currentPlayerColour) {
    socket.emit("It's not your turn!");
    return;
  }
  //console log in terminal move data received
  console.log("Server has received a move");

  try {
    //when you receive a move from the opponent, run the make move function
    //return gamestatemanager and board to send to the client
    //this function will run the gamestatemnager.makemove() and return json objects of board and gamestate to send back to client
    const newGameState = getNewGameState(
      jsonMoveData,
      gameInstance.gameStateManager,
      gameInstance.board
    );

    //send to everyone, including the client that sent the data
    socket.emit("new game state", newGameState);
    console.log("new game state and board as been sent to the client");
  } catch (err) {
    console.error("Server error processing move:", err);
    socket.emit(
      "error",
      err.message ||
        "An error occurred on the server when processing your move."
    );
  }
}
