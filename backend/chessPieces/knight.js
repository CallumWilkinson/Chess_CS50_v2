import ChessPiece from "./ChessPiece.js";
import { toSquareNotation } from "../../shared/utilities/toSquareNotation.js";

/**
 * @param {string} colour
 * @param {Position} position
 */

export default class Knight extends ChessPiece {
  constructor(colour, position) {
    super("knight", colour, position);
    this.whiteUnicodeLogo = "\u2658";
    this.blackUnicodeLogo = "\u265E";
  }

  /**
   * @param {Board} board
   * @returns {string[]}
   */

  getPossibleMoves(board) {
    const validMoves = [];
    const knightPossibleSquareNames = [];

    //access rank and file index properties from the position class
    const fileIndex = this.position.fileIndex;
    const rankIndex = this.position.rankIndex;

    //find all possible knight landing squares (names of them as strings)
    const upLeft = toSquareNotation(fileIndex - 1, rankIndex + 2);
    const upRight = toSquareNotation(fileIndex + 1, rankIndex + 2);
    const rightUp = toSquareNotation(fileIndex + 2, rankIndex + 1);
    const rightDown = toSquareNotation(fileIndex + 2, rankIndex - 1);
    const downRight = toSquareNotation(fileIndex + 1, rankIndex - 2);
    const downLeft = toSquareNotation(fileIndex - 1, rankIndex - 2);
    const leftUp = toSquareNotation(fileIndex - 2, rankIndex + 1);
    const leftDown = toSquareNotation(fileIndex - 2, rankIndex - 1);

    knightPossibleSquareNames.push(
      upLeft,
      upRight,
      rightUp,
      rightDown,
      downLeft,
      downRight,
      leftUp,
      leftDown
    );

    //check knight squares are empty and in LOS, add to valid moves
    for (const square in knightPossibleSquareNames) {
      if (
        board.squareIsEmpty(knightPossibleSquareNames[square]) &&
        board.squareExistsOnBoard(knightPossibleSquareNames[square]) &&
        knightPossibleSquareNames[square] != this.position.name
      ) {
        validMoves.push(knightPossibleSquareNames[square]);
      }
      //check for capture
      const possibleCapture = board.grid[knightPossibleSquareNames[square]];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        board.squareExistsOnBoard(knightPossibleSquareNames[square]) &&
        knightPossibleSquareNames[square] != this.position.name
      ) {
        //add possible capture
        validMoves.push(knightPossibleSquareNames[square]);
      }
    }
    return validMoves;
  }
}
