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
    //if in LOS AND if on same vertical axis OR horizonal axis add to valid moves array
    for (const square in board.grid) {
      //variables for readability
      const targetSquare = new Position(square);
      const sameVerticalAxis = square[0] == startingPositionName[0];
      const sameHorizontalAxis = square[1] == startingPositionName[1];

      const isInLineOfSight = this.position.squareIsInLineOfSight(
        targetSquare,
        board
      );
      //if space is empty add possible move
      if (board.squareIsEmpty(square) && isInLineOfSight) {
        //only add if also on same vertical or horizontal axis
        if (sameVerticalAxis || sameHorizontalAxis) {
          validMoves.push(square);
        }
      }
      //if space has enemy piece, add possible capture
      const possibleCapture = board.grid[square];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        isInLineOfSight
      ) {
        //only add if also on same vertical or horizontal axis
        if (sameVerticalAxis || sameHorizontalAxis) {
          validMoves.push(square);
        }
      }
    }

    return validMoves;
  }
}
