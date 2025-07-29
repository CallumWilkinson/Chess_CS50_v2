import ChessPiece from "./ChessPiece.js";
import Position from "../gameLogic/position.js";

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
    const validMoves = [];

    for (const square in board.grid) {
      const targetPosition = new Position(square);
      if (
        board.squareIsEmpty(square) &&
        //does LOS also include diagonal?
        //do diagonals pass as true?
        this.position.isTraversable(targetPosition, board) &&
        square != this.position.name
      ) {
        validMoves.push(square);
      }
      const possibleCapture = board.grid[square];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        this.position.isTraversable(targetPosition, board) &&
        square != this.position.name
      ) {
        validMoves.push(square);
      }
    }

    return validMoves;
  }
}
