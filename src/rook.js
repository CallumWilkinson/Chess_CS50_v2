import ChessPiece from "./ChessPiece.js";
import Position from "./position.js";
/**
 * @param {string} colour
 * @param {Position} position
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

    const startingPositionName = this.position.name;

    //loop over each key in dictionary
    //check if each square is empty and in LOS of the rook (checks diagonals also)
    //AND if on same vertical axis OR horizonal axis add to valid moves array(a bishop would just be diagonals only, queen is all directions)
    for (const square in board.grid) {
      const targetSquare = new Position(square);
      if (
        board.squareIsEmpty(square) &&
        this.position.squareIsInLineOfSight(targetSquare, board)
      ) {
        //only add if also on same vertical axis
        if (square[0] == startingPositionName[0]) {
          const verticalPosition = square[0] + "" + square[1];
          validMoves.push(verticalPosition);
        }
        //only add if also on same horizontal axis
        else if (square[1] == startingPositionName[1]) {
          const horizontalPosition = square[0] + "" + square[1];
          validMoves.push(horizontalPosition);
        }
      }
    }

    return validMoves;
  }
}
