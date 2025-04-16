import { UIConstants } from "./constants.js";

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
}
