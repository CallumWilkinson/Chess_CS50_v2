import Board from "./board";
import ChessPiece from "./ChessPiece";

export default class Bishop extends ChessPiece {
  constructor(colour, position) {
    super("bishop", colour, position);
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    const validMoves = [];

    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        board.squareIsInLineOfSight(position, square, this)
      ) {
        //only add if in same diagonal NE
        if (
          (square[0 + 1] == this.position[0]) &
          (square[1 + 1] == this.position[1])
        ) {
          const diagonalPosition = square[0] + "" + square[1];
          validMoves.push(diagonalPosition);
        }
        //only add if in same diagonal SW
        else if (
          (square[0 - 1] == this.position[0]) &
          (square[1 - 1] == this.position[1])
        ) {
          const diagonalPosition = square[0] + "" + square[1];
          validMoves.push(diagonalPosition);
        }
        //only add if in same diagonal NW
        else if (
          (square[0 - 1] == this.position[0]) &
          (square[1 + 1] == this.position[1])
        ) {
          const diagonalPosition = square[0] + "" + square[1];
          validMoves.push(diagonalPosition);
        }
        //only add if in same diagonal SE
        else if (
          (square[0 + 1] == this.position[0]) &
          (square[1 - 1] == this.position[1])
        ) {
          const diagonalPosition = square[0] + "" + square[1];
          validMoves.push(diagonalPosition);
        }
      }
    }

    return validMoves;
  }
}
