import ChessPiece from "./ChessPiece.js";

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

  //CHANGE THIS TO ADD OBJECTS TO THE DICT INSTEAD OF STRINGS
  initialisePieces() {
    //       // For example, place white pawns
    //   // row 2 is typically the white pawns row, so squares a2, b2... h2
    //   // But your setup might differ depending on how you’re indexing.
    //   const columnLabels = "abcdefgh";
    //   for (let column of columnLabels) {
    //     const square = column + "2";
    //     this.grid[square] = new Pawn("pawn", "white", square);
    //   }

    //   // Place black pawns on row 7
    //   for (let column of columnLabels) {
    //     const square = column + "7";
    //     this.grid[square] = new Pawn("pawn", "black", square);
    //   }

    //   // Place rooks, knights, bishops, etc.
    //   // Example for white rook on a1:
    //   this.grid["a1"] = new ChessPiece("rook", "white", "a1");
    //   this.grid["h1"] = new ChessPiece("rook", "white", "h1");
    //   // ...and so on for knights, bishops, queen, king.

    //   // Similarly for black pieces on the 8th rank.
    //   this.grid["a8"] = new ChessPiece("rook", "black", "a8");
    //   this.grid["h8"] = new ChessPiece("rook", "black", "a8");
    //   // etc.
    // }
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
