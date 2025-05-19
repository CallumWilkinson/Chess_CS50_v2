import ChessPiece from "./ChessPiece.js";
import Position from "./position.js";

/**
 * @param {string} colour
 * @param {Position} position
 */

export default class Bishop extends ChessPiece {
  constructor(colour, position) {
    super("bishop", colour, position);
    this.whiteUnicodeLogo = "\u2657";
    this.blackUnicodeLogo = "\u265D";
  }

  /**
   * @param {Board} board
   * @returns {string[]} - array of strings (position names)
   */

  getPossibleMoves(board) {
    const validMoves = [];

    //a piece is diagonal if rank dif === file dif
    //LOOPS OVER THE ENTIRE BOARD
    for (const square in board.grid) {
      const targetPosition = new Position(square);

      //calc differences in file and rank to determine if square is diagonal
      const fileDiff = Math.abs(
        this.position.fileIndex - targetPosition.fileIndex
      );
      const rankDiff = Math.abs(
        this.position.rankIndex - targetPosition.rankIndex
      );
      //create variables for readability
      const isDiagonal = fileDiff === rankDiff;
      const isInLineOfSight = this.position.isTraversable(
        targetPosition,
        board
      );
      const isNotBishopsPosition = square != this.position.name;

      //if empty space, add as possible move
      if (
        board.squareIsEmpty(square) &&
        isDiagonal &&
        isInLineOfSight &&
        isNotBishopsPosition
      ) {
        validMoves.push(targetPosition.name);
      }

      //if enemy piece, add as possible capture
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
