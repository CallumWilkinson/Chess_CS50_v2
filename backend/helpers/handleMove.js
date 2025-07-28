import { getNewGameState } from "../gameLogic/getNewGameState.js";

/**
 * Handle a chess move request from a client
 * Validates the move, processes it through game logic, and broadcasts the result
 * @param {Object} socket - The socket connection from the client making the move
 * @param {Object} jsonMoveData - Move data containing chessPiece and targetSquare
 * @param {SessionManager} sessionManager - Session manager instance for player/game lookups
 * @param {Object} io - Socket.io server instance for broadcasting to rooms
 */
export function handleMove(socket, jsonMoveData, sessionManager, io) {
  //get the game instance for this socket
  const gameInstance = sessionManager.getGameInstanceBySocket(socket.id);
  if (!gameInstance) {
    socket.emit("error", "Game session not found");
    return;
  }

  //get the player for this socket
  const player = sessionManager.getPlayerBySocketId(socket.id);
  if (!player) {
    socket.emit("error", "Player not found");
    return;
  }

  //validate that it is this player's turn to move using game-specific logic
  if (!gameInstance.gameStateManager || !gameInstance.gameStateManager.turnManager) {
    socket.emit("error", "Game not properly initialized");
    return;
  }

  const currentPlayerColour = gameInstance.gameStateManager.turnManager.currentPlayerColour;
  if (player.colour !== currentPlayerColour) {
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
      gameInstance.gameStateManager,
      gameInstance.board
    );

    //get the session id to emit to the correct room
    const gameSessionID = sessionManager.getSessionIdBySocket(socket.id);
    if (!gameSessionID) {
      socket.emit("error", "Session mapping not found");
      return;
    }

    //send the move to everyone in the socket room, so it sends to player A and player B
    //remember that in launchServer.js I called socket.join(gameSessionID), this created a "socket room" and gave it the same name as it's corresponding gameSessionID
    //its confusing but socket.to(roomID).emit will exclude the sender, but i need to call it on the SERVER not the socket, so that i can include the sender as the sender also needs to get back the updated game state after its move has been validated
    io.to(gameSessionID).emit("newGameState", newGameState);
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
