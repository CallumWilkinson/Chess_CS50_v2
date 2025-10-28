import Position from "./position.js";
import { ChessConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Shared utilities for chess piece move validation
 * Eliminates code duplication across chess piece classes
 */
export default class MoveValidation {
  /**
   * @param {Board} board
   * @param {ChessPiece} piece
   */
  constructor(board, piece) {
    this.board = board;
    this.piece = piece;
  }

  /**
   * @param {string} squareName
   */
  isValidEmptySquare(squareName) {
    return (
      this.board.squareExistsOnBoard(squareName) &&
      this.board.squareIsEmpty(squareName)
    );
  }

  /**
   * @param {string} squareName
   */
  isValidCaptureSquare(squareName) {
    if (!this.board.squareExistsOnBoard(squareName)) {
      return false;
    }

    const targetPiece = this.board.grid[squareName];
    return (
      targetPiece !== null &&
      targetPiece.colour !== this.piece.colour
    );
  }

  /**
   * @param {string} squareName
   */
  hasLineOfSight(squareName) {
    const targetPosition = new Position(squareName);
    return this.piece.position.isTraversable(targetPosition, this.board);
  }

  /**
   * @param {string} squareName
   */
  isValidMoveSquare(squareName) {
    return (
      this.hasLineOfSight(squareName) &&
      (this.isValidEmptySquare(squareName) || this.isValidCaptureSquare(squareName))
    );
  }

  /**
   * @param {string} squareName
   */
  isSameRank(squareName) {
    return squareName[1] === this.piece.position.name[1];
  }

  /**
   * @param {string} squareName
   */
  isSameFile(squareName) {
    return squareName[0] === this.piece.position.name[0];
  }

  /**
   * @param {string} squareName
   */
  isRookMove(squareName) {
    return this.isSameRank(squareName) || this.isSameFile(squareName);
  }

  /**
   * @param {string} squareName
   */
  isDiagonalMove(squareName) {
    const targetPosition = new Position(squareName);
    const fileDiff = Math.abs(this.piece.position.fileIndex - targetPosition.fileIndex);
    const rankDiff = Math.abs(this.piece.position.rankIndex - targetPosition.rankIndex);
    return fileDiff === rankDiff;
  }

  /**
   * @param {string} squareName
   */
  isBishopMove(squareName) {
    return this.isDiagonalMove(squareName);
  }

  /**
   * @param {string} squareName
   */
  isQueenMove(squareName) {
    return this.isRookMove(squareName) || this.isBishopMove(squareName);
  }

  /**
   * @param {string} squareName
   */
  isKingMove(squareName) {
    const targetPosition = new Position(squareName);
    const fileDiff = Math.abs(this.piece.position.fileIndex - targetPosition.fileIndex);
    const rankDiff = Math.abs(this.piece.position.rankIndex - targetPosition.rankIndex);
    return fileDiff <= ChessConstants.KING_MOVEMENT_RANGE && rankDiff <= ChessConstants.KING_MOVEMENT_RANGE;
  }

  /**
   * @param {string} squareName
   */
  isKnightMove(squareName) {
    const targetPosition = new Position(squareName);
    const fileDiff = Math.abs(this.piece.position.fileIndex - targetPosition.fileIndex);
    const rankDiff = Math.abs(this.piece.position.rankIndex - targetPosition.rankIndex);
    return (fileDiff === ChessConstants.KNIGHT_LONG_MOVE && rankDiff === ChessConstants.KNIGHT_SHORT_MOVE) || (fileDiff === ChessConstants.KNIGHT_SHORT_MOVE && rankDiff === ChessConstants.KNIGHT_LONG_MOVE);
  }

  /**
   * @param {string[]} candidateSquares
   * @param {function} movementValidator
   */
  filterValidMoves(candidateSquares, movementValidator) {
    return candidateSquares.filter(square => 
      movementValidator.call(this, square) && this.isValidMoveSquare(square)
    );
  }

  /**
   * @param {function} movementValidator
   */
  getAllValidMoves(movementValidator) {
    const allSquares = Object.keys(this.board.grid);
    return this.filterValidMoves(allSquares, movementValidator);
  }
}