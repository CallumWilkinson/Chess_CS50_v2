import Bishop from "../../../chessCore/chessPieces/bishop.js";
import Board from "../../../chessCore/gameLogic/board.js";
import King from "../../../chessCore/chessPieces/king.js";
import Knight from "../../../chessCore/chessPieces/knight.js";
import Pawn from "../../../chessCore/chessPieces/pawn.js";
import Queen from "../../../chessCore/chessPieces/queen.js";
import Rook from "../../../chessCore/chessPieces/rook.js";
import { createTestBoard } from "../../helpers/testFactories.js";

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
    const boardWithPieces = createTestBoard();
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
      expect(boardWithPieces.grid[position]).toBeInstanceOf(
        expectedWhitePieces[position]
      );
      expect(boardWithPieces.grid[position].colour).toBe("white");
    }
  });

  test("setup black peices on board", () => {
    const boardWithPieces = createTestBoard();
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
      expect(boardWithPieces.grid[position]).toBeInstanceOf(
        expectedPieces[position]
      );
      expect(boardWithPieces.grid[position].colour).toBe("black");
    }
  });

  test("square exists on board", () => {
    const boardWithPieces = createTestBoard();
    expect(boardWithPieces.squareExistsOnBoard("a9")).toBe(false);
    expect(boardWithPieces.squareExistsOnBoard("a4")).toBe(true);
  });

  test("square is empty", () => {
    const boardWithPieces = createTestBoard();
    expect(boardWithPieces.squareIsEmpty("a6")).toBe(true);
  });
});

