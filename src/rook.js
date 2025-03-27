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

    //loop over dictionary grid
    //check if squares that are emtpy and in LOS of the rook
    //if so add square to validMoves array
    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        //does LOS also include diagonal?
        //do diagonals pass as true?
        board.squareIsInLineOfSight(startingPosition, square, this)
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
