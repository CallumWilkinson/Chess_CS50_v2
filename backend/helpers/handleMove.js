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


  try {
    //when you receive a move from the opponent, run the make move function
    //return gamestatemanager and board to send to the client
    //this function will run the gamestatemnager.makemove() and return json objects of board and gamestate to send back to client
    const moveResult = getNewGameState(
      jsonMoveData,
      gameInstance.gameStateManager,
      gameInstance.board
    );

    if (!moveResult.success) {
      socket.emit("error", moveResult.error);
      return;
    }

    //get the session id to emit to the correct room
    const gameSessionID = sessionManager.getSessionIdBySocket(socket.id);
    if (!gameSessionID) {
      socket.emit("error", "Session mapping not found");
      return;
    }

    //broadcast move result to all players in the game session
    //socket.join() was called in launchServer.js to create the room mapping
    //using io.to() instead of socket.to() ensures the move sender also receives the updated state
    io.to(gameSessionID).emit("newGameState", moveResult.gameState);
  } catch (err) {
    console.error("Server error processing move:", err);
    socket.emit(
      "error",
      err.message ||
        "An error occurred on the server when processing your move."
    );
  }
}
