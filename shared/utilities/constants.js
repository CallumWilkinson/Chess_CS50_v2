/**
 * Game status constants for tracking chess game state
 * @readonly
 * @enum {string}
 */
export const GameStatus = {
  /** Game is still in progress */
  ONGOING: "ongoing",
  /** Game ended with checkmate */
  CHECKMATE: "checkmate",
  /** Game ended with stalemate */
  STALEMATE: "stalemate",
  /** Game ended in a draw */
  DRAW: "draw",
};

/**
 * UI rendering constants for the chess board display
 * @readonly
 * @enum {number}
 */
export const UIConstants = {
  /** Size of each chess board tile in pixels */
  TILESIZE: 80,
  /** Number of squares per side on a chess board */
  BOARDSIZE: 8,
};

/**
 * Chess board coordinate constants
 * Files (columns) are labeled a-h, ranks (rows) are labeled 1-8
 * @readonly
 */
export const FilesAndRanks = {
  /** Chess board files (columns) from left to right */
  FILES: ["a", "b", "c", "d", "e", "f", "g", "h"],
  /** Chess board ranks (rows) from bottom to top */
  RANKS: ["1", "2", "3", "4", "5", "6", "7", "8"],
};
