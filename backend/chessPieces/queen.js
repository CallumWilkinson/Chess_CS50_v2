import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";

/**
 * Represents a Queen chess piece
 * The most powerful piece - can move any number of squares in any direction
 * Combines the movement patterns of rook and bishop
 */
export default class Queen extends ChessPiece {
  /**
   * Creates a new Queen piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("queen", colour, position);
    this.whiteUnicodeLogo = "\u2655";
    this.blackUnicodeLogo = "\u265B";
  }

  /**
   * Calculate all valid moves for the queen
   * Queens can move any number of squares horizontally, vertically, or diagonally
   * Combines rook and bishop movement patterns
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the queen can move to
   */
  getPossibleMoves(board) {
    const validator = new MoveValidation(board, this);
    const allSquares = Object.keys(board.grid);
    return allSquares.filter(square => 
      square !== this.position.name &&
      validator.hasLineOfSight(square) && 
      (validator.isValidEmptySquare(square) || validator.isValidCaptureSquare(square))
    );
  }
}
