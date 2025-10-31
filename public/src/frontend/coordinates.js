import { UIConstants } from "./shared/utilities/constants.js";
import { getFileIndex } from "./shared/utilities/toSquareNotation.js";
import { transformCoordinatesForPlayer } from "./boardOrientation.js";

/**
 * Convert chess square notation to canvas pixel coordinates
 * Used for Playwright tests to simulate clicks on specific squares
 * Accounts for board orientation based on player color
 * @param {string} square - Chess square notation (e.g., "e2", "a1")
 * @param {string} playerColour - Player's color for board orientation ("white" or "black")
 * @returns {{x: number, y: number}} Canvas coordinates pointing to center of the square
 */
export function squareToCanvasCoordinates(square, playerColour = "black") {
  const file = getFileIndex(square);
  //rank is the number, convert to index (1->0, 2->1, etc.)
  const rank = parseInt(square[1]) - 1;

  // Transform coordinates based on player perspective
  const { rank: transformedRank, file: transformedFile } = transformCoordinatesForPlayer(rank, file, playerColour);

  return {
    x: transformedFile * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
    y: transformedRank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
  };
}
