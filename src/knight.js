import ChessPiece from "./ChessPiece.js";
import Board from "./board.js";

export default class Knight extends ChessPiece {
  constructor(colour, position) {
    super("knight", colour, position);
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    const validMoves = [];
    const knightSquares = [];

    //convert to numbers for math
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //find all possible knight landing squares
    const upLeft = this._toSquare(fileIndex - 1, rankIndex + 2);
    const upRight = this._toSquare(fileIndex + 1, rankIndex + 2);
    const rightUp = this._toSquare(fileIndex + 2, rankIndex + 1);
    const rightDown = this._toSquare(fileIndex + 2, rankIndex - 1);
    const downRight = this._toSquare(fileIndex + 1, rankIndex - 2);
    const downLeft = this._toSquare(fileIndex - 1, rankIndex - 2);
    const leftUp = this._toSquare(fileIndex - 2, rankIndex + 1);
    const leftDown = this._toSquare(fileIndex - 2, rankIndex - 1);

    knightSquares.push(
      upLeft,
      upRight,
      rightUp,
      rightDown,
      downLeft,
      downRight,
      leftUp,
      leftDown
    );

    //check knight squares and empty and in LOS, add to valid moves
    for (const square in knightSquares) {
      if (
        board.squareIsEmpty(knightSquares[square]) &&
        board.squareExistsOnBoard(knightSquares[square]) &&
        knightSquares[square] != this.position
      ) {
        validMoves.push(knightSquares[square]);
      }
    }
    return validMoves;
  }
}
