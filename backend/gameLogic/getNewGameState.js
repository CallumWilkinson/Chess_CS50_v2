import Position from "./position.js";

/**
 * Process a move request and update the game state
 * Handles move validation, execution, and returns updated game state
 * @param {Object} jsonMoveData - Move data from client containing chessPiece and targetSquare
 * @param {GameStateManager} currentGameStateManager - Current game state manager instance
 * @param {Board} board - Current board state
 * @returns {Object} Result object with success status and either gameState or error message
 */
export function getNewGameState(jsonMoveData, currentGameStateManager, board) {
  try {
    const { chessPiece, targetSquare } = jsonMoveData;

    if (!board.grid[chessPiece.position.name]) {
      return {
        success: false,
        error: "Selected piece not found on board"
      };
    }

    const selectedPiece = board.grid[chessPiece.position.name];
    const possibleMovesArray = selectedPiece.getPossibleMoves(board);

    //json data coming from the client sends the target square as a string
    //but the server side tests still use a Position object
    //handle both cases here to keep backwards compatibility
    let targetSquareName;
    if (typeof targetSquare === "string") {
      targetSquareName = targetSquare;
    } else {
      targetSquareName = targetSquare.name;
    }

    const targetSquarePositionObject = new Position(targetSquareName);

    const moveSuccessful = currentGameStateManager.makeMove(
      selectedPiece,
      targetSquarePositionObject,
      possibleMovesArray
    );

    if (moveSuccessful) {
      return {
        success: true,
        gameState: { currentGameStateManager }
      };
    } else {
      return {
        success: false,
        error: "Move validation failed"
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error occurred while processing move"
    };
  }
}
