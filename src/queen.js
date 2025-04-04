import Board from "./board.js";
import ChessPiece from "./ChessPiece.js";

export default class Queen extends ChessPiece {
  constructor(colour, position) {
    super("queen", colour, position);
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    //a queen can move any number of spaces in any direction
    const validMoves = [];

    //convert current position to numbers so we can do math on it (eg e4 = 4,3)
    //i dont think we need this line?
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //convert curretn posisition to square notation
    //i think we dont need this we can just use position as a string normally?
    const startingPosition = this._toSquare(fileIndex, rankIndex);

    //loop over dictionary grid
    //check if each square is empty and in LOS of the queen (checks diagonals also)
    //AND if on same vertical axis OR horizonal axis add to valid moves array(a bishop would just be diagonals only, queen is all directions)
    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        //does LOS also include diagonal?
        //do diagonals pass as true?
        board.squareIsInLineOfSight(startingPosition, square, this) &&
        square != this.position
      ) {
        validMoves.push(square);
      }
    }

    return validMoves;
  }
}
