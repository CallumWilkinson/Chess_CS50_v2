import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";
import Position from "../gameLogic/position.js";

/**
 * Represents a King chess piece
 * Can move one square in any direction (horizontal, vertical, diagonal)
 * The most important piece - losing the king ends the game
 */
export default class King extends ChessPiece {
  /**
   * Creates a new King piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("king", colour, position);
    this.whiteUnicodeLogo = "\u2654";
    this.blackUnicodeLogo = "\u265A";
  }

  /**
   * Calculate all valid moves for the king
   * Kings can move one square in any direction (8 possible moves maximum)
   * Checks for empty squares and enemy pieces that can be captured
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the king can move to
   */
  getPossibleMoves(board) {
    const surroundingSquareNames = this.position.surroundingpositionNames;
    const candidateSquares = Object.values(surroundingSquareNames);

    const validator = new MoveValidation(board, this);
    return candidateSquares.filter(square => {
      return (
        validator.board.squareExistsOnBoard(square) &&
        validator.hasLineOfSight(square) &&
        (validator.isValidEmptySquare(square) || validator.isValidCaptureSquare(square))
      );
    });
  }
}
