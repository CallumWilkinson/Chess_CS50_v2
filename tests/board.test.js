// //import board class
import Board from "../src/board.js";

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
    expect(board.grid).toHaveProperty("a2", "white_pawn");
    expect(board.grid).toHaveProperty("d2", "white_pawn");
    expect(board.grid).toHaveProperty("h2", "white_pawn");
    expect(board.grid).toHaveProperty("a1", "white_rook");
    expect(board.grid).toHaveProperty("b1", "white_knight");
    expect(board.grid).toHaveProperty("f1", "white_bishop");
    expect(board.grid).toHaveProperty("d1", "white_queen");
    expect(board.grid).toHaveProperty("e1", "white_king");
  });

  test("setup black peices on board", () => {
    board.createEmptyBoard();
    board.initialisePieces();
    expect(board.grid).toHaveProperty("a7", "black_pawn");
    expect(board.grid).toHaveProperty("d7", "black_pawn");
    expect(board.grid).toHaveProperty("h7", "black_pawn");
    expect(board.grid).toHaveProperty("a8", "black_rook");
    expect(board.grid).toHaveProperty("b8", "black_knight");
    expect(board.grid).toHaveProperty("f8", "black_bishop");
    expect(board.grid).toHaveProperty("d8", "black_queen");
    expect(board.grid).toHaveProperty("e8", "black_king");
  });
});
