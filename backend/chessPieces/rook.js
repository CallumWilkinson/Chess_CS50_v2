import ChessPiece from "./ChessPiece.js";
import Position from "../gameLogic/position.js";

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
    const validMoves = [];
    const startingPositionName = this.position.name;

    for (const square in board.grid) {
      const targetSquare = new Position(square);
      const sameVerticalAxis = square[0] == startingPositionName[0];
      const sameHorizontalAxis = square[1] == startingPositionName[1];

      const isInLineOfSight = this.position.isTraversable(targetSquare, board);
      if (board.squareIsEmpty(square) && isInLineOfSight) {
        if (sameVerticalAxis || sameHorizontalAxis) {
          validMoves.push(square);
        }
      }
      const possibleCapture = board.grid[square];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        isInLineOfSight
      ) {
        if (sameVerticalAxis || sameHorizontalAxis) {
          validMoves.push(square);
        }
      }
    }

    return validMoves;
  }
}
