import Board from "./board.js";
import ChessPiece from "./ChessPiece.js";
import Position from "./position.js";
import { toSquareNotation } from "./utils/toSquareNotation.js";
/**
 * @param {string} colour
 * @param {Position} position
 */

export default class Queen extends ChessPiece {
  constructor(colour, position) {
    super("queen", colour, position);
    this.whiteUnicodeLogo = "\u2655";
    this.blackUnicodeLogo = "\u265B";
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    //a queen can move any number of spaces in any direction
    const validMoves = [];

    const startingPositionName = this.position.name;

    //loop over dictionary grid
    //check if each square is empty and in LOS of the queen (checks diagonals also)
    //AND if on same vertical axis OR horizonal axis add to valid moves array(a bishop would just be diagonals only, queen is all directions)
    for (const square in board.grid) {
      let targetPosition = new Position(square);
      if (
        board.squareIsEmpty(square) &&
        //does LOS also include diagonal?
        //do diagonals pass as true?
        this.position.squareIsInLineOfSight(targetPosition, board) &&
        square != this.position.name
      ) {
        validMoves.push(square);
      }
    }

    return validMoves;
  }
}
