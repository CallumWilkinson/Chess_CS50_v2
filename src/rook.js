import Board from "./board";
import ChessPiece from "./ChessPiece";

export default class Rook extends ChessPiece {
  constructor(colour, position) {
    super("rook", colour, position);
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    //a rook can move any number of spaces up, down, left, right
    const validMoves = [];

    //convert current position to numbers so we can do math on it (eg e4 = 4,3)
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //convert curretn posisition to square notation
    const startingPosition = this._toSquare(fileIndex, rankIndex);

    //check every position around to see if it is occupied
    //loop over dictionary
    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        //change how this is called for rook and for bishop
        board.squareIsInLineOfSight(startingPosition, square, this)
      ) {
        if (square[0] == startingPosition[0]) {
          const verticalPosition = square[0] + "" + square[1];
          validMoves.push(verticalPosition);
        } else if (square[1] == startingPosition[1]) {
          const horizontalPosition = square[0] + "" + square[1];
          validMoves.push(horizontalPosition);
        }
      }
    }

    return validMoves;
  }
}
