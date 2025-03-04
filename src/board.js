//board class represents a chess board
export default class Board {
  constructor() {
    //create a grid PROPERTY for the class
    //grid is a dictionary
    this.grid = {};
  }

  createEmptyBoard() {
    const columnLabels = "abcdefgh";
    for (let row = 1; row <= 8; row++) {
      for (let column of columnLabels) {
        const square = row + column;
        //fill grid dict with blank squares
        this.grid[square] = null;
      }
    }
  }
}
