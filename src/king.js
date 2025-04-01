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
    const { startingFileIndex, startingRankIndex } = this.parsePosition(
      this.position
    );

    //find all surrounding squares
    const right = this._toSquare(startingFileIndex + 1, startingRankIndex);
    const left = this._toSquare(startingFileIndex - 1, startingRankIndex);
    const up = this._toSquare(startingFileIndex, startingRankIndex + 1);
    const down = this._toSquare(startingFileIndex, startingRankIndex - 1);
    const diagonalNE = this._toSquare(
      startingFileIndex + 1,
      startingRankIndex + 1
    );
    const diagonalSE = this._toSquare(
      startingFileIndex + 1,
      startingRankIndex - 1
    );
    const diagonalSW = this._toSquare(
      startingFileIndex - 1,
      startingRankIndex - 1
    );
    const diagonalNW = this._toSquare(
      startingFileIndex - 1,
      startingRankIndex + 1
    );

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
        board.squareIsEmpty(square) &&
        board.squareIsInLineOfSight(this.position, square, this) &&
        square != this.position
      ) {
        validMoves.push(square);
      }
    }
    return validMoves;
  }
}
