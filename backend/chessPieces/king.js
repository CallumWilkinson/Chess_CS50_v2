import ChessPiece from "./ChessPiece.js";
import Position from "../gameLogic/position.js";

/**
 * Represents a King chess piece
 * Can move one square in any direction (horizontal, vertical, diagonal)
 * The most important piece - losing the king ends the game
 */
export default class King extends ChessPiece {
  /**
   * Creates a new King piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("king", colour, position);
    this.whiteUnicodeLogo = "\u2654";
    this.blackUnicodeLogo = "\u265A";
  }

  /**
   * Calculate all valid moves for the king
   * Kings can move one square in any direction (8 possible moves maximum)
   * Checks for empty squares and enemy pieces that can be captured
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the king can move to
   */
  getPossibleMoves(board) {
    const validMoves = [];
    const surroundingSquareNames = this.position.surroundingpositionNames;

    for (const squareName in surroundingSquareNames) {
      if (
        board.squareIsEmpty(surroundingSquareNames[squareName]) &&
        this.position.isTraversable(
          new Position(surroundingSquareNames[squareName]),
          board
        ) &&
        board.squareExistsOnBoard(surroundingSquareNames[squareName]) &&
        surroundingSquareNames[squareName] != this.position.name
      ) {
        validMoves.push(surroundingSquareNames[squareName]);
      }

      const possibleCapture = board.grid[surroundingSquareNames[squareName]];
      if (
        possibleCapture != null &&
        possibleCapture.colour != this.colour &&
        this.position.isTraversable(
          new Position(surroundingSquareNames[squareName]),
          board
        ) &&
        board.squareExistsOnBoard(surroundingSquareNames[squareName]) &&
        surroundingSquareNames[squareName] != this.position.name
      ) {
        validMoves.push(surroundingSquareNames[squareName]);
      }
    }

    return validMoves;
  }
}
