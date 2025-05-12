import ChessPiece from "./ChessPiece.js";
import Position from "./position.js";

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
   * @returns {string[]} array of strings, names of possible moves
   */

  getPossibleMoves(board) {
    //array of position objects
    const validMoves = [];
    const surroundingSquareNames = this.position.surroundingpositionNames;

    //check surrounding squares are empty and in LOS, add to valid moves
    for (const squareName in surroundingSquareNames) {
      if (
        board.squareIsEmpty(surroundingSquareNames[squareName]) &&
        this.position.squareIsInLineOfSight(
          new Position(surroundingSquareNames[squareName]),
          board
        ) &&
        board.squareExistsOnBoard(surroundingSquareNames[squareName]) &&
        surroundingSquareNames[squareName] != this.position.name
      ) {
        validMoves.push(surroundingSquareNames[squareName]);
      }
    }
    return validMoves;
  }
}
