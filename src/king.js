import ChessPiece from "./ChessPiece";
import Board from "./board";

export default class King extends ChessPiece {
  constructor(colour, position) {
    super("king", colour, position);
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    const validMoves = [];
    const surroundingSquares = [];

    //convert to numbers for math
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //find all surrounding squares
    const right = this._toSquare(fileIndex + 1, rankIndex);
    const left = this._toSquare(fileIndex - 1, rankIndex);
    const up = this._toSquare(fileIndex, rankIndex + 1);
    const down = this._toSquare(fileIndex, rankIndex - 1);
    const diagonalNE = this._toSquare(fileIndex + 1, rankIndex + 1);
    const diagonalSE = this._toSquare(fileIndex + 1, rankIndex - 1);
    const diagonalSW = this._toSquare(fileIndex - 1, rankIndex - 1);
    const diagonalNW = this._toSquare(fileIndex - 1, rankIndex + 1);

    surroundingSquares.push(
      right,
      left,
      up,
      down,
      diagonalNE,
      diagonalSE,
      diagonalNW,
      diagonalSW
    );

    //check surrounding squares and empty and in LOS, add to valid moves
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
