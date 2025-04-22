import Board from "./board.js";
import ChessPiece from "./ChessPiece.js";

/**
 * @param {Position} position
 * @param {string} colour
 */

export default class Rook extends ChessPiece {
  constructor(colour, position) {
    super("rook", colour, position);
    this.whiteUnicodeLogo = "\u2656";
    this.blackUnicodeLogo = "\u265C";
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    //a rook can move any number of spaces up, down, left, right
    const validMoves = [];

    //convert current position to numbers so we can do math on it (eg e4 = 4,3)
    //i dont think we need this line?
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //convert curretn posisition to square notation
    //i think we dont need this we can just use position as a string normally?
    const startingPosition = this._toSquare(fileIndex, rankIndex);

    //loop over each key in dictionary
    //check if each square is empty and in LOS of the rook (checks diagonals also)
    //AND if on same vertical axis OR horizonal axis add to valid moves array(a bishop would just be diagonals only, queen is all directions)
    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        //does LOS also include diagonal?
        //do diagonals pass as true?
        board.squareIsInLineOfSight(this.position, square)
      ) {
        //only add if also on same vertical axis
        if (square[0] == startingPosition[0]) {
          const verticalPosition = square[0] + "" + square[1];
          validMoves.push(verticalPosition);
        }
        //only add if also on same horizontal axis
        else if (square[1] == startingPosition[1]) {
          const horizontalPosition = square[0] + "" + square[1];
          validMoves.push(horizontalPosition);
        }
      }
    }

    return validMoves;
  }
}
