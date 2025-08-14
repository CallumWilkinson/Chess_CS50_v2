import Pawn from "../chessPieces/pawn.js";
import Rook from "../chessPieces/rook.js";
import Knight from "../chessPieces/knight.js";
import King from "../chessPieces/king.js";
import Queen from "../chessPieces/queen.js";
import Bishop from "../chessPieces/bishop.js";
import Position from "./position.js";
import { FilesAndRanks } from "../../shared/utilities/constants.js";
import { ChessConstants, CoordinateConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Represents a chess board with a grid of squares and pieces
 * Manages board state through a dictionary where keys are square names (e.g., 'a1', 'e4')
 * and values are chess piece instances or null for empty squares
 */
export default class Board {
  /**
   * Creates a new empty board instance
   */
  constructor() {
    this.grid = {};
  }

  /**
   * Initialize the board with all squares set to null (empty)
   * Sets up the grid dictionary where keys are square names (e.g., 'a1', 'e4')
   */
  createEmptyBoard() {
    FilesAndRanks.RANKS.forEach((rank) => {
      for (const file of FilesAndRanks.FILES) {
        const position = new Position(file + rank);
        this.grid[position.name] = null;
      }
    });
  }
  /**
   * Initialize all chess pieces in their starting positions
   * Game state is tracked by piece positions in the grid dictionary
   */
  initialisePieces() {
    const whiteRookLeft = new Rook("white", new Position("a1"));
    const blackRookLeft = new Rook("black", new Position("a8"));

    const whiteKnightLeft = new Knight("white", new Position("b1"));
    const blackKnightLeft = new Knight("black", new Position("b8"));

    const whiteBishopLeft = new Bishop("white", new Position("c1"));
    const blackBishopLeft = new Bishop("black", new Position("c8"));

    const whiteQueen = new Queen("white", new Position("d1"));
    const blackQueen = new Queen("black", new Position("d8"));

    const whiteKing = new King("white", new Position("e1"));
    const blackKing = new King("black", new Position("e8"));

    const whiteBishopRight = new Bishop("white", new Position("f1"));
    const blackBishopRight = new Bishop("black", new Position("f8"));

    const whiteKnightRight = new Knight("white", new Position("g1"));
    const blackKnightRight = new Knight("black", new Position("g8"));

    const whiteRookRight = new Rook("white", new Position("h1"));
    const blackRookRight = new Rook("black", new Position("h8"));

    const pieces = [
      whiteRookLeft,
      blackRookLeft,
      whiteKnightLeft,
      blackKnightLeft,
      whiteBishopLeft,
      blackBishopLeft,
      whiteKing,
      blackKing,
      whiteQueen,
      blackQueen,
      whiteBishopRight,
      blackBishopRight,
      whiteKnightRight,
      blackKnightRight,
      whiteRookRight,
      blackRookRight,
    ];

    for (const piece in pieces) {
      const key = pieces[piece].position.name;
      this.grid[key] = pieces[piece];
    }

    const whitePawns = [];

    for (let i = 0; i < ChessConstants.PAWNS_PER_COLOR; i++) {
      whitePawns.push(
        new Pawn("white", new Position(String.fromCharCode(CoordinateConstants.ASCII_FILE_A + i) + ChessConstants.WHITE_PAWN_RANK))
      );
    }

    for (const pawn in whitePawns) {
      const key = whitePawns[pawn].position.name;
      this.grid[key] = whitePawns[pawn];
    }

    const blackPawns = [];

    for (let i = 0; i < ChessConstants.PAWNS_PER_COLOR; i++) {
      blackPawns.push(
        new Pawn("black", new Position(String.fromCharCode(CoordinateConstants.ASCII_FILE_A + i) + ChessConstants.BLACK_PAWN_RANK))
      );
    }

    for (const pawn in blackPawns) {
      const key = blackPawns[pawn].position.name;
      this.grid[key] = blackPawns[pawn];
    }
  }

  /**
   * Check if a square exists on the board (valid square name)
   * Prevents accessing nonexistent dictionary keys
   * @param {string} square - Square name in algebraic notation (e.g., 'a3', 'e4')
   * @returns {boolean} True if square exists on board, false otherwise
   */
  squareExistsOnBoard(square) {
    if (square in this.grid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if a square is empty (contains no piece)
   * @param {string} square - Square name in algebraic notation (e.g., 'a3', 'e4')
   * @returns {boolean} True if square is empty (null), false if occupied
   */
  squareIsEmpty(square) {
    if (this.grid[square] == null) {
      return true;
    } else {
      return false;
    }
  }
}
