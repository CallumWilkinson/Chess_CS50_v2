import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";
import { toSquareNotation } from "../../shared/utilities/toSquareNotation.js";
import { ChessConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Represents a Knight chess piece
 * Moves in an L-shape: long move in one direction, then short move perpendicular
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
    this.whiteUnicodeLogo = "\u2658";
    this.blackUnicodeLogo = "\u265E";
  }

  /**
   * Calculate all valid moves for the knight
   * Knights move in an L-shape: long move in one direction, then short move perpendicular
   * Can jump over other pieces (no line-of-sight restrictions)
   * @param {Board} board - Current board state
   * @returns {string[]} Array of valid square names the knight can move to
   */
  getPossibleMoves(board) {
    const fileIndex = this.position.fileIndex;
    const rankIndex = this.position.rankIndex;

    const knightPossibleSquareNames = [
      toSquareNotation(fileIndex - ChessConstants.KNIGHT_SHORT_MOVE, rankIndex + ChessConstants.KNIGHT_LONG_MOVE),
      toSquareNotation(fileIndex + ChessConstants.KNIGHT_SHORT_MOVE, rankIndex + ChessConstants.KNIGHT_LONG_MOVE),
      toSquareNotation(fileIndex + ChessConstants.KNIGHT_LONG_MOVE, rankIndex + ChessConstants.KNIGHT_SHORT_MOVE),
      toSquareNotation(fileIndex + ChessConstants.KNIGHT_LONG_MOVE, rankIndex - ChessConstants.KNIGHT_SHORT_MOVE),
      toSquareNotation(fileIndex + ChessConstants.KNIGHT_SHORT_MOVE, rankIndex - ChessConstants.KNIGHT_LONG_MOVE),
      toSquareNotation(fileIndex - ChessConstants.KNIGHT_SHORT_MOVE, rankIndex - ChessConstants.KNIGHT_LONG_MOVE),
      toSquareNotation(fileIndex - ChessConstants.KNIGHT_LONG_MOVE, rankIndex + ChessConstants.KNIGHT_SHORT_MOVE),
      toSquareNotation(fileIndex - ChessConstants.KNIGHT_LONG_MOVE, rankIndex - ChessConstants.KNIGHT_SHORT_MOVE)
    ];

    const validator = new MoveValidation(board, this);
    return knightPossibleSquareNames.filter(square => {
      return (
        validator.board.squareExistsOnBoard(square) &&
        (validator.isValidEmptySquare(square) || validator.isValidCaptureSquare(square))
      );
    });
  }
}
