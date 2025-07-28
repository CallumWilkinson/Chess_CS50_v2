import ChessPiece from "./ChessPiece.js";
import { toSquareNotation } from "../../shared/utilities/toSquareNotation.js";

/**
 * Represents a Knight chess piece
 * Moves in an L-shape: 2 squares in one direction, then 1 square perpendicular
 * The only piece that can jump over other pieces
 */
export default class Knight extends ChessPiece {
  /**
   * Creates a new Knight piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("knight", colour, position);
    //unicode symbols for display
    this.whiteUnicodeLogo = "\u2658";
    this.blackUnicodeLogo = "\u265E";
  }

  /**
   * Calculate all valid moves for the knight
   * Knights move in an L-shape: 2 squares in one direction, then 1 square perpendicular
   * Can jump over other pieces (no line-of-sight restrictions)
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the knight can move to
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
