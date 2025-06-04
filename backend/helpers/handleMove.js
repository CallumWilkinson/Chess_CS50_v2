import { getNewGameState } from "../gameLogic/getNewGameState.js";

export function handleMove(
  socket,
  jsonMoveData,
  gameSessions,
  socketIDtoGameID
) {
  //get gameID from socketid of the player
  const gameID = socketIDtoGameID[socket.id];

  //get session data of the game the player is connected to
  const currentSessionData = gameSessions[gameID];

  //check if the move is from the current player
  const currentPlayerColour =
    currentSessionData.gameInstance.gameStateManager.turnManager
      .currentPlayerColour;

  //get all players in this current session
  const players = currentSessionData.connectedPlayersSocketIDs.players;

  //send error to client if player tried to move when its not their turn
  if (players[socket.id].colour !== currentPlayerColour) {
    socket.emit("notYourTurn");
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
      currentSessionData.gameInstance.gameStateManager,
      currentSessionData.gameInstance.board
    );

    //send the move to everyone, including the client that sent the data
    socket.emit("newGameState", newGameState);
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
