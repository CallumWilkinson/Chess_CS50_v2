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
    //unicode symbols for display
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

    //check surrounding squares are empty and in LOS, add to valid moves
    for (const squareName in surroundingSquareNames) {
      //if square is empty, in LOS of the king, exists on the board AND is not the current kings position
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
      //check for possible captures
      //if iterated square contains enemy piece, in LOS of the king, exists on the board AND is not the current kings position
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
        //capture
        validMoves.push(surroundingSquareNames[squareName]);
      }
    }

    return validMoves;
  }
}
