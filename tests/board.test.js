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
    board.createEmptyBoard(); // Populate the board
    expect(Object.keys(board.grid).length).toBe(64); // Ensure 64 keys exist
  });
});
