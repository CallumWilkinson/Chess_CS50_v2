import { FilesAndRanks } from "../../shared/utilities/constants.js";
import { toSquareNotation, getFileIndex, getRankIndex } from "../../shared/utilities/toSquareNotation.js";

/**
 * Represents a position on the chess board
 * Handles square notation, coordinates, and line-of-sight calculations
 */
export default class Position {
  /**
   * Creates a new position instance
   * @param {string} name - Square name in algebraic notation (e.g., 'e5', 'a1')
   */
  constructor(name) {
    this.name = name;
    this.file = this.name[0];
    this.rank = this.name[1];

    this.fileIndex = getFileIndex(this.name);
    this.rankIndex = getRankIndex(this.name);
    this.surroundingpositionNames = this._getSurroundingPositionNames();
  }

  /**
   * Get the names of all valid squares adjacent to this position
   * This function is only run once privately each time a new position is made,
   * so that its result can be saved to a property for faster access
   * @returns {string[]} Array of square names surrounding this position
   * @private
   */
  _getSurroundingPositionNames() {
    const surroundingSquares = [];

    const filePlusOne = String.fromCharCode(this.file.charCodeAt(0) + 1);
    const fileMinusOne = String.fromCharCode(this.file.charCodeAt(0) - 1);
    const rankPlusOne = String.fromCharCode(this.rank.charCodeAt(0) + 1);
    const rankMinusOne = String.fromCharCode(this.rank.charCodeAt(0) - 1);

    const right = filePlusOne + this.rank;
    const left = fileMinusOne + this.rank;
    const up = this.file + rankPlusOne;
    const down = this.file + rankMinusOne;
    const diagonalNE = filePlusOne + rankPlusOne;
    const diagonalSE = filePlusOne + rankMinusOne;
    const diagonalSW = fileMinusOne + rankMinusOne;
    const diagonalNW = fileMinusOne + rankPlusOne;

    surroundingSquares.push(
      right,
      left,
      up,
      down,
      diagonalNE,
      diagonalSE,
      diagonalSW,
      diagonalNW
    );

    const validSurroundingSquares = surroundingSquares.filter((position) => {
      return (
        FilesAndRanks.FILES.includes(position[0]) &&
        FilesAndRanks.RANKS.includes(position[1])
      );
    });

    return validSurroundingSquares;
  }

  /**
   * Check if there is a clear line of sight to the target square
   * Used for pieces that move in straight lines (rook, bishop, queen)
   * @param {Position} targetSquare - The destination position to check
   * @param {Board} board - The current board state
   * @returns {boolean} True if path is clear, false if blocked by pieces
   */
  isTraversable(targetSquare, board) {
    const fileIndexDifferential = targetSquare.fileIndex - this.fileIndex;
    const absFileIndexDifferential = Math.abs(fileIndexDifferential);

    const rankIndexDifferential = targetSquare.rankIndex - this.rankIndex;
    const absRankIndexDifferential = Math.abs(rankIndexDifferential);

    const isSameFile = absFileIndexDifferential === 0;
    const isSameRank = absRankIndexDifferential === 0;
    const isDiagonal = absFileIndexDifferential === absRankIndexDifferential;

    if (!isSameFile && !isSameRank && !isDiagonal) {
      return false;
    }

    const fileDirection = Math.sign(fileIndexDifferential);
    const rankDirection = Math.sign(rankIndexDifferential);

    let currentFileIndex = this.fileIndex + fileDirection;
    let currentRankIndex = this.rankIndex + rankDirection;

    while (
      currentFileIndex !== targetSquare.fileIndex ||
      currentRankIndex !== targetSquare.rankIndex
    ) {
      const currentSquare = new Position(
        toSquareNotation(currentFileIndex, currentRankIndex)
      );

      if (
        board.grid[currentSquare.name] != null &&
        board.grid[currentSquare.name] != undefined
      ) {
        return false;
      }
      currentFileIndex += fileDirection;
      currentRankIndex += rankDirection;
    }

    // If no occupied spaces found on path, target square IS in line of sight
    return true;
  }
}
