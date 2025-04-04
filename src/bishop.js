import Board from "./board.js";
import ChessPiece from "./ChessPiece.js";

export default class Bishop extends ChessPiece {
  constructor(colour, position) {
    super("bishop", colour, position);
    this.whiteUnicodeLogo = "\u2657";
    this.blackUnicodeLogo = "\u265D";
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    const validMoves = [];

    //a piece is diagonal if rank dif === file dif
    for (const square in board.grid) {
      if (
        board.squareIsEmpty(square) &&
        board.squareIsInLineOfSight(this.position, square, this) &&
        square != this.position
      ) {
        //split string so we can calculate rank diff and file diff
        const [fileStart, rankStart] = this.position.split("");
        const [fileCurrent, rankCurrent] = square.split("");

        //calc differences
        const fileDiff = Math.abs(
          fileStart.charCodeAt(0) - fileCurrent.charCodeAt(0)
        );
        const rankDiff = Math.abs(parseInt(rankStart) - parseInt(rankCurrent));

        //check diagonal
        if (fileDiff === rankDiff) {
          validMoves.push(square);
        }
      }
    }

    return validMoves;
  }
}
