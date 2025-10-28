import Bishop from "../../../core/chessPieces/bishop.js";
import Board from "../../../core/gameLogic/board.js";
import King from "../../../core/chessPieces/king.js";
import Knight from "../../../core/chessPieces/knight.js";
import Pawn from "../../../core/chessPieces/pawn.js";
import Queen from "../../../core/chessPieces/queen.js";
import Rook from "../../../core/chessPieces/rook.js";

describe("Chess Board", () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test("should initialize an empty grid", () => {
    expect(board.grid).toEqual({});
  });

  test("should contain exactly 64 squares in the grid", () => {
    board.createEmptyBoard();
    expect(Object.keys(board.grid).length).toBe(64);
  });

  test("setup white peices on board", () => {
    board.createEmptyBoard();
    board.initialisePieces();
    const expectedWhitePieces = {
      a2: Pawn,
      d2: Pawn,
      h2: Pawn,
      a1: Rook,
      b1: Knight,
      f1: Bishop,
      d1: Queen,
      e1: King,
    };

    for (const position in expectedWhitePieces) {
      expect(board.grid[position]).toBeInstanceOf(
        expectedWhitePieces[position]
      );
      expect(board.grid[position].colour).toBe("white");
    }
  });

  test("setup black peices on board", () => {
    board.createEmptyBoard();
    board.initialisePieces();
    const expectedPieces = {
      a7: Pawn,
      d7: Pawn,
      h7: Pawn,
      a8: Rook,
      b8: Knight,
      f8: Bishop,
      d8: Queen,
      e8: King,
    };

    for (const position in expectedPieces) {
      expect(board.grid[position]).toBeInstanceOf(expectedPieces[position]);
      expect(board.grid[position].colour).toBe("black");
    }
  });

  test("square exists on board", () => {
    board.createEmptyBoard();
    board.initialisePieces();
    expect(board.squareExistsOnBoard("a9")).toBe(false);
    expect(board.squareExistsOnBoard("a4")).toBe(true);
  });

  test("square is empty", () => {
    board.createEmptyBoard();
    board.initialisePieces();
    expect(board.squareIsEmpty("a6")).toBe(true);
  });
});
