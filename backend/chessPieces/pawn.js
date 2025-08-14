import ChessPiece from "./ChessPiece.js";
import MoveValidation from "../gameLogic/moveValidation.js";
import { toSquareNotation } from "../../shared/utilities/toSquareNotation.js";

/**
 * Represents a Pawn chess piece
 * Moves forward one square, captures diagonally forward
 * Can move two squares on first move, and has special en passant capture rules
 */
export default class Pawn extends ChessPiece {
  /**
   * Creates a new Pawn piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("pawn", colour, position);

    this.whiteUnicodeLogo = "\u2659";
    this.blackUnicodeLogo = "\u265F";
  }

  /**
   * Calculates all possible moves for this pawn.
   * @param {Board} board - An instance of Board class.
   * @returns {string[]} Array of valid square names (e.g., ['e4', 'f3']).
   */
  getPossibleMoves(board) {
    const validMoves = [];
    const validator = new MoveValidation(board, this);

    const direction = this.colour === "white" ? 1 : -1;
    const fileIndex = this.position.fileIndex;
    const rankIndex = this.position.rankIndex;

    const oneSquareForward = toSquareNotation(fileIndex, rankIndex + direction);
    const twoSquaresForward = toSquareNotation(fileIndex, rankIndex + direction * 2);

    if (validator.isValidEmptySquare(oneSquareForward)) {
      validMoves.push(oneSquareForward);

      if (!this.hasMoved && validator.isValidEmptySquare(twoSquaresForward)) {
        validMoves.push(twoSquaresForward);
      }
    }

    const leftCapture = toSquareNotation(fileIndex - 1, rankIndex + direction);
    const rightCapture = toSquareNotation(fileIndex + 1, rankIndex + direction);

    if (validator.isValidCaptureSquare(leftCapture)) {
      validMoves.push(leftCapture);
    }

    if (validator.isValidCaptureSquare(rightCapture)) {
      validMoves.push(rightCapture);
    }

    return validMoves;
  }
}
