/**
 * Core game constants for chess application
 * Centralizes magic numbers to improve maintainability and readability
 */

/**
 * Chess board and game mechanics constants
 * @readonly
 */
export const ChessConstants = {
  /** Number of squares per side on a chess board */
  BOARD_SIZE: 8,

  /** Total number of squares on a chess board */
  TOTAL_SQUARES: 64,

  /** Total number of chess pieces at game start */
  TOTAL_PIECES: 32,

  /** Number of pieces per color at game start */
  PIECES_PER_COLOR: 16,

  /** Number of pawns per color */
  PAWNS_PER_COLOR: 8,

  /** Maximum number of players in a chess game */
  MAX_PLAYERS: 2,

  //** Maximum time per player per game */\
  TOTAL_MILLISECONDS_PER_PLAYER: 300000,

  /** Starting rank for white pawns (1-indexed) */
  WHITE_PAWN_RANK: "2",

  /** Starting rank for black pawns (1-indexed) */
  BLACK_PAWN_RANK: "7",

  /** King movement range (squares in any direction) */
  KING_MOVEMENT_RANGE: 1,

  /** Pawn single move distance */
  PAWN_SINGLE_MOVE: 1,

  /** Pawn double move distance (first move only) */
  PAWN_DOUBLE_MOVE: 2,

  /** Knight L-shaped movement: long side distance */
  KNIGHT_LONG_MOVE: 2,

  /** Knight L-shaped movement: short side distance */
  KNIGHT_SHORT_MOVE: 1,
};

/**
 * Chess coordinate system constants
 * @readonly
 */
export const CoordinateConstants = {
  /** ASCII code for file 'a' - used for file index calculations */
  ASCII_FILE_A: 97,

  /** Minimum file index (0-based) */
  MIN_FILE_INDEX: 0,

  /** Maximum file index (0-based) */
  MAX_FILE_INDEX: 7,

  /** Minimum rank index (0-based) */
  MIN_RANK_INDEX: 0,

  /** Maximum rank index (0-based) */
  MAX_RANK_INDEX: 7,

  /** Conversion offset from 0-based rank to 1-based rank */
  RANK_INDEX_OFFSET: 1,
};

/**
 * System and networking constants
 * @readonly
 */
export const SystemConstants = {
  /** Default server port */
  DEFAULT_PORT: 3000,

  /** Length of generated session and instance IDs */
  ID_LENGTH: 6,

  /** Radix for generating random alphanumeric strings */
  RANDOM_STRING_RADIX: 36,

  /** Starting position in random string to extract ID */
  RANDOM_STRING_START: 2,

  /** Ending position in random string to extract ID */
  RANDOM_STRING_END: 8,

  /** Array splice position for removing single item */
  SINGLE_ITEM_REMOVAL: 1,
};

/**
 * Chess piece movement direction constants
 * @readonly
 */
export const MovementConstants = {
  /** White piece direction (up the board) */
  WHITE_DIRECTION: 1,

  /** Black piece direction (down the board) */
  BLACK_DIRECTION: -1,

  /** No movement on file axis */
  NO_FILE_MOVEMENT: 0,

  /** No movement on rank axis */
  NO_RANK_MOVEMENT: 0,
};
