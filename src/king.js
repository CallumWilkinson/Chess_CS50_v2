import ChessPiece from "./ChessPiece.js";
import Board from "./board.js";

/**
 * @param {string} colour
 * @param {Position} position
 */

export default class King extends ChessPiece {
  constructor(colour, position) {
    super("king", colour, position);
    this.whiteUnicodeLogo = "\u2654";
    this.blackUnicodeLogo = "\u265A";
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    //array of position objects
    const validMoves = [];
    const surroundingSquares = this.position.surroundingpositionNames;

    //check surrounding squares are empty and in LOS, add to valid moves
    for (const square in surroundingSquares) {
      if (
        board.squareIsEmpty(surroundingSquares[square]) &&
        board.squareIsInLineOfSight(
          this.position,
          surroundingSquares[square],
          this
        ) &&
        board.squareExistsOnBoard(surroundingSquares[square]) &&
        surroundingSquares[square] != this.position
      ) {
        validMoves.push(surroundingSquares[square]);
      }
    }
    return validMoves;
  }
}
