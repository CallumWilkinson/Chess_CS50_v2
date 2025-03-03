//import board class
const Board = require("../src/board.js");

//describe is a jest function to group related tests together into a test suite called "chess board"
describe("Chess Board", () => {
  let board;

  //beforeEach is jest function to make a new board before each test is run
  beforeEach(() => {
    board = newBoard();
  });

  //first test ensures board has 8 rows and 8 columns, board is an array
  test("should initialise an 8x8 array as a board", () => {
    expect(board.grid.length).toBe(8);
    expect(board.grid[0].length).toBe(8);
  });

  //   //second test checks that all black and white pieces are correctly placed
  //   test("pieces are correctly placed", () => {
  //     //check top left is white rook
  //     expect(board.getPiece(0, 0).ToBe("R"));

  //     //check bottom middle is black king
  //     expect(board.getPiece(7, 4).ToBe("k"));
  //   });
});
