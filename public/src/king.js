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
    const validMoves = [];
    const surroundingSquareNames = this.position.surroundingpositionNames;

    //check surrounding squares are empty and in LOS, add to valid moves
    for (const squareName in surroundingSquareNames) {
      //if square is empty, in LOS of the king, exists on the board AND is not the current kings position
      if (
        board.squareIsEmpty(surroundingSquareNames[squareName]) &&
        this.position.isTraversable(
          new Position(surroundingSquareNames[squareName]),
          board
        ) &&
        board.squareExistsOnBoard(surroundingSquareNames[squareName]) &&
        surroundingSquareNames[squareName] != this.position.name
      ) {
        validMoves.push(surroundingSquareNames[squareName]);
      }

      const possibleCapture = board.grid[surroundingSquareNames[squareName]];
      //check for possible captures
      //if iterated square contains enemy piece, in LOS of the king, exists on the board AND is not the current kings position
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        this.position.isTraversable(
          new Position(surroundingSquareNames[squareName]),
          board
        ) &&
        board.squareExistsOnBoard(surroundingSquareNames[squareName]) &&
        surroundingSquareNames[squareName] != this.position.name
      ) {
        //capture
        validMoves.push(surroundingSquareNames[squareName]);
      }
    }

    return validMoves;
  }
}
