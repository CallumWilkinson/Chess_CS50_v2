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
        const square = row + column;
        //add keys eg a1, b1 ect and set values to null
        this.grid[square] = null;
      }
    }
  }

  setupPieces() {}
}
