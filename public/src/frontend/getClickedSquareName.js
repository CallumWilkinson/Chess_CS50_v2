import { UIConstants } from "./shared/utilities/constants.js";
import { toSquareNotation } from "./shared/utilities/toSquareNotation.js";

/**
 * Convert mouse click coordinates to chess square notation
 * Takes mouse click position and calculates which chess square was clicked
 * @param {MouseEvent} event - Mouse click event containing coordinates
 * @param {HTMLCanvasElement} canvas - Chess board canvas element
 * @returns {string} Chess notation square name (e.g., "e4", "a1")
 */
export default function getClickedSquareName(event, canvas) {
  const canvasRect = canvas.getBoundingClientRect();

  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
  const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE));

  const firstClickedSquareName = toSquareNotation(file, rank);
  return firstClickedSquareName;
}
