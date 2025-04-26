import { FilesAndRanks, UIConstants } from "./constants.js";

/**
 * @param {string} name - name of a position on the chess board 'e5' ect
 */

export default class Position {
  constructor(name) {
    this.name = name;
    this.file = this.name[0];
    this.rank = this.name[1];

    //changes the letter to a number, int type
    this.fileIndex = this.name.charCodeAt(0) - "a".charCodeAt(0);

    //changes the digit in the second position of the string 'name' to a number starting from 0
    // '1' -> 0, '8' -> 7
    this.rankIndex = parseInt(this.name[1], 10) - 1;

    //array of strings - strings are the names of the positions surrounding this position
    this.surroundingpositionNames = this.#getSurroundingPositionNames();
  }

  /**
   * @returns {{ x: number, y: number }} - the x and y canvas coordinates (center of the square passed through)
   */

  getCanvasCoordinates() {
    return {
      //this function has not been testsed as i dont think i need it??
      //target the center of the square, multiply position by pixels to get the pixel position
      x: this.fileIndex * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
      y: (8 - this.rankIndex) * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
    };
  }

  /**
   * @returns {Array[string]} - returns array of strings
   * this function is only run once privately each time a new positon is made, so that its result can be saved to a property for faster access
   */

  #getSurroundingPositionNames() {
    const surroundingSquares = [];

    //variables for readability
    const filePlusOne = String.fromCharCode(this.file.charCodeAt(0) + 1);
    const fileMinusOne = String.fromCharCode(this.file.charCodeAt(0) - 1);
    const rankPlusOne = String.fromCharCode(this.rank.charCodeAt(0) + 1);
    const rankMinusOne = String.fromCharCode(this.rank.charCodeAt(0) - 1);

    //find all surrounding squares as strings
    const right = filePlusOne + this.rank;
    const left = fileMinusOne + this.rank;
    const up = this.file + rankPlusOne;
    const down = this.file + rankMinusOne;
    const diagonalNE = filePlusOne + rankPlusOne;
    const diagonalSE = filePlusOne + rankMinusOne;
    const diagonalSW = fileMinusOne + rankMinusOne;
    const diagonalNW = fileMinusOne + rankPlusOne;

    //add to array only if the square actually exists on the board
    surroundingSquares.forEach((i) => {
      if (FilesAndRanks.FILES.includes(surroundingSquares[i])) {
        surroundingSquares.push(surroundingSquares[i]);
      }
    });
    return surroundingSquares;
  }
}
