import Bishop from "../backend/chessPieces/bishop.js";
import Board from "../backend/gameLogic/board.js";
import King from "../backend/chessPieces/king.js";
import Knight from "../backend/chessPieces/knight.js";
import Pawn from "../backend/chessPieces/pawn.js";
import Queen from "../backend/chessPieces/queen.js";
import Rook from "../backend/chessPieces/rook.js";

//describe is a jest function to group related tests together into a test suite called "chess board"
describe("Chess Board", () => {
  let board;

  //beforeeach is jest function that runs before each test
  //instantiate a board object from the Board class
  beforeEach(() => {
    board = new Board();
  });

  test("should initialize an empty grid", () => {
    expect(board.grid).toEqual({}); // Check if grid starts as an empty DICTIONARY object
  });

  test("should contain exactly 64 squares in the grid", () => {
    board.createEmptyBoard(); // Populate the board with null values
    expect(Object.keys(board.grid).length).toBe(64); // Ensure 64 keys exist
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

    for (let position in expectedWhitePieces) {
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

    for (let position in expectedPieces) {
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
