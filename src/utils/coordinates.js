import { UIConstants } from "../constants.js";

/**
 * @param {string} square - square as a string like e2 ect
 * @returns {{ x: number, y: number }} - the x and y canvas coordinates (center of the square passed through)
 */

//used for playwrite tests
export function squareToCanvasCoordinates(square) {
  //file is the letter
  const file = square.charCodeAt(0) - "a".charCodeAt(0);

  //rank is the number, need to reverse it cos its a chess grid
  const rank = 8 - parseInt(square[1]);

  return {
    //target the center of the square, multiply position by pixels to get the pixel position
    x: file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
    y: rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
  };
}
