import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";

/**
 * Represents a Rook chess piece
 * Can move any number of squares horizontally or vertically
 * One of the major pieces, valuable for controlling ranks and files
 */
export default class Rook extends ChessPiece {
  /**
   * Creates a new Rook piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("rook", colour, position);
    this.whiteUnicodeLogo = "\u2656";
    this.blackUnicodeLogo = "\u265C";
  }

  /**
   * Calculate all valid moves for the rook
   * Rooks can move any number of squares up, down, left, or right
   * Cannot jump over other pieces
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the rook can move to
   */
  getPossibleMoves(board) {
    const validator = new MoveValidation(board, this);
    return validator.getAllValidMoves(validator.isRookMove);
  }
}
