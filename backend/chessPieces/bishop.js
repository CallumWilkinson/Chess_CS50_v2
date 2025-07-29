import ChessPiece from "./ChessPiece.js";
import Position from "../gameLogic/position.js";

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
    const validMoves = [];

    for (const square in board.grid) {
      const targetPosition = new Position(square);

      const fileDiff = Math.abs(
        this.position.fileIndex - targetPosition.fileIndex
      );
      const rankDiff = Math.abs(
        this.position.rankIndex - targetPosition.rankIndex
      );
      const isDiagonal = fileDiff === rankDiff;
      const isInLineOfSight = this.position.isTraversable(
        targetPosition,
        board
      );
      const isNotBishopsPosition = square != this.position.name;

      if (
        board.squareIsEmpty(square) &&
        isDiagonal &&
        isInLineOfSight &&
        isNotBishopsPosition
      ) {
        validMoves.push(targetPosition.name);
      }

      const possibleCapture = board.grid[targetPosition.name];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        isDiagonal &&
        isInLineOfSight &&
        isNotBishopsPosition
      ) {
        validMoves.push(targetPosition.name);
      }
    }
    return validMoves;
  }
}
