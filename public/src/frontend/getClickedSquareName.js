import { UIConstants } from "../../../shared/utilities/constants.js";
import { toSquareNotation } from "../../../shared/utilities/toSquareNotation.js";

/**
 * @param {MouseEvent} event mouse event
 * @param {HTMLElement} canvas
 * @returns {string} firstClickedSquareName Chess notation square (e.g. "e4").
 */

export default function getClickedSquareName(event, canvas) {
  //returns position and size of canvas relative to viewport
  const canvasRect = canvas.getBoundingClientRect();

  //get mouse position, minus the top left corner of canvas in pixels
  //x and y now become the actual positions on the canvas where the user clicked
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  //get file and rank clicked
  const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
  const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE));

  //find chess peice in that square as string to use as key
  const firstClickedSquareName = toSquareNotation(file, rank);
  return firstClickedSquareName;
}
