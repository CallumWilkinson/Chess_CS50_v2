import Board from "./board.js";
import ChessPiece from "./ChessPiece.js";
import Position from "./position.js";

export default class Bishop extends ChessPiece {
  constructor(colour, position) {
    super("bishop", colour, position);
    this.whiteUnicodeLogo = "\u2657";
    this.blackUnicodeLogo = "\u265D";
  }

  /**
   * @param {Board} board
   * @returns {Position[]} - array of positions
   */

  getPossibleMoves(board) {
    const validMoves = [];

    //a piece is diagonal if rank dif === file dif
    //square is a string
    for (const square in board.grid) {
      let targetPosition = new Position(square);
      if (
        board.squareIsEmpty(square) &&
        //currently iterated key (string) is used to make a new position object aka - the target position
        board.squareIsInLineOfSight(this.position, targetPosition) &&
        square != this.position.name
      ) {
        //split string so we can calculate rank diff and file diff
        const [fileStart, rankStart] = this.position.split("");
        const [fileCurrent, rankCurrent] = square.split("");

        //calc differences
        const fileDiff = Math.abs(
          this.position.fileIndex - targetPosition.fileIndex
        );
        const rankDiff = Math.abs(
          this.position.rankIndex - targetPosition.rankIndex
        );

        //check diagonal
        validMoves.push(targetPosition);
        if (fileDiff === rankDiff) {
        }
      }
    }

    return validMoves;
  }
}
