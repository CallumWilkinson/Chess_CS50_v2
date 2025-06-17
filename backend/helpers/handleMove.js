import { getNewGameState } from "../gameLogic/getNewGameState.js";

export function handleMove(
  socket,
  jsonMoveData,
  gameSessions,
  socketIDtoGameID,
  io
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

    console.log(io);

    //send the move to everyone in the socket room, so it sends to player A and player B
    //remember that in launchServer.js I called socket.join(gameID), this created a "socket room" and gave it the same name as it's corresponding gameID
    //its confusing but socket.to(roomID).emit will exclude the sender, but i need to call it on the SERVER not the socket, so that i can include the sender as the sender also needs to get back the updated game state after its move has been validated
    io.to(gameID).emit("newGameState", newGameState);
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
