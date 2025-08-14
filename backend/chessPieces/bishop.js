import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";

/**
 * Represents a Bishop chess piece
 * Can move any number of squares diagonally
 * Each player starts with two bishops (one on light squares, one on dark squares)
 */
export default class Bishop extends ChessPiece {
  /**
   * Creates a new Bishop piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("bishop", colour, position);
    this.whiteUnicodeLogo = "\u2657";
    this.blackUnicodeLogo = "\u265D";
  }

  /**
   * Calculate all valid moves for the bishop
   * Bishops can move any number of squares diagonally
   * A piece is diagonal if rank difference equals file difference
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the bishop can move to
   */
  getPossibleMoves(board) {
    const validator = new MoveValidation(board, this);
    return validator.getAllValidMoves(validator.isBishopMove);
  }
}
