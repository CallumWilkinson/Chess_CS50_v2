import { UIConstants } from "/static/shared/utilities/constants.js";
import { toSquareNotation } from "/static/shared/utilities/toSquareNotation.js";
import { transformCoordinatesForPlayer } from "./boardOrientation.js";

/**
 * Convert mouse click coordinates to chess square notation
 * Takes mouse click position and calculates which chess square was clicked
 * Accounts for board orientation based on player color
 * @param {MouseEvent} event - Mouse click event containing coordinates
 * @param {HTMLCanvasElement} canvas - Chess board canvas element
 * @param {string} playerColour - Current player's color for coordinate transformation
 * @returns {string} Chess notation square name (e.g., "e4", "a1")
 */
export default function getClickedSquareName(event, canvas, playerColour) {
  const canvasRect = canvas.getBoundingClientRect();

  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  // Get clicked canvas coordinates (same as original)
  const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
  const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE));

  // Apply player perspective transformation to the raw canvas coordinates
  const { rank: logicalRank, file: logicalFile } = transformCoordinatesForPlayer(rank, file, playerColour);

  const firstClickedSquareName = toSquareNotation(logicalFile, logicalRank);
  return firstClickedSquareName;
}
