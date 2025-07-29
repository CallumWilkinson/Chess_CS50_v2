import { UIConstants } from "./shared/utilities/constants.js";
import { getFileIndex } from "./shared/utilities/toSquareNotation.js";

/**
 * Convert chess square notation to canvas pixel coordinates
 * Used for Playwright tests to simulate clicks on specific squares
 * @param {string} square - Chess square notation (e.g., "e2", "a1")
 * @returns {{x: number, y: number}} Canvas coordinates pointing to center of the square
 */
export function squareToCanvasCoordinates(square) {
  const file = getFileIndex(square);
  //rank is the number, need to reverse it cos its a chess grid
  const rank = 8 - parseInt(square[1]);

  return {
    x: file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
    y: rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
  };
}
