//board class represents a chess board
export default class Board {
  constructor() {
    //create a grid PROPERTY for the class
    //grid is a dictionary
    this.grid = {};
    this.files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    this.ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  }

  createEmptyBoard() {
    const columnLabels = "abcdefgh";
    //row is the number, column is the letter
    for (let row = 1; row <= 8; row++) {
      for (let column of columnLabels) {
        //square is a string
        const square = column + row;
        //add keys eg a1, b1 ect and set values to null
        this.grid[square] = null;
      }
    }
  }

  initialisePieces() {
    //add white pawns to the dictionary
    Object.keys(this.grid)
      .slice(8, 16)
      .forEach((key) => {
        this.grid[key] = "white_pawn";
      });

    //add black pawns to the dictionary
    Object.keys(this.grid)
      .slice(48, 56)
      .forEach((key) => {
        this.grid[key] = "black_pawn";
      });

    // White pieces
    const whiteSetup = {
      a1: "white_rook",
      b1: "white_knight",
      c1: "white_bishop",
      d1: "white_queen",
      e1: "white_king",
      f1: "white_bishop",
      g1: "white_knight",
      h1: "white_rook",
    };

    // Black pieces
    const blackSetup = {
      a8: "black_rook",
      b8: "black_knight",
      c8: "black_bishop",
      d8: "black_queen",
      e8: "black_king",
      f8: "black_bishop",
      g8: "black_knight",
      h8: "black_rook",
    };

    Object.assign(this.grid, whiteSetup, blackSetup);
  }
}
