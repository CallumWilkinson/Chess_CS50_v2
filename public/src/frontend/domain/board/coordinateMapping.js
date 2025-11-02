import { UIConstants } from "@shared/utilities/constants.js";

/**
 * Converts chess square coordinates to canvas pixel coordinates
 * @param {number} fileIndex - File index (0-7, a-h)
 * @param {number} rankIndex - Rank index (0-7, 1-8)
 * @returns {{x: number, y: number}} Canvas pixel coordinates for top-left corner
 */
export function squareToPixelCoordinates(fileIndex, rankIndex) {
  return {
    x: fileIndex * UIConstants.TILESIZE,
    y: rankIndex * UIConstants.TILESIZE,
  };
}

/**
 * Converts chess square coordinates to canvas pixel coordinates for piece center
 * @param {number} fileIndex - File index (0-7, a-h)
 * @param {number} rankIndex - Rank index (0-7, 1-8)
 * @returns {{x: number, y: number}} Canvas pixel coordinates for piece center
 */
export function squareToPieceCenterCoordinates(fileIndex, rankIndex) {
  return {
    x: fileIndex * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
    y: rankIndex * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
  };
}

/**
 * Calculates canvas coordinates for rank label positioning
 * @param {number} rankIndex - Rank index (0-7, 1-8)
 * @returns {{x: number, y: number}} Canvas pixel coordinates for rank label
 */
export function getRankLabelCoordinates(rankIndex) {
  const baseCoordinates = squareToPixelCoordinates(0, rankIndex);
  return {
    x: baseCoordinates.x + 5,
    y: baseCoordinates.y + UIConstants.TILESIZE * 0.7,
  };
}

/**
 * Calculates canvas coordinates for file label positioning
 * @param {number} fileIndex - File index (0-7, a-h)
 * @returns {{x: number, y: number}} Canvas pixel coordinates for file label
 */
export function getFileLabelCoordinates(fileIndex) {
  const baseCoordinates = squareToPixelCoordinates(fileIndex, 7);
  return {
    x: baseCoordinates.x + UIConstants.TILESIZE * 0.75,
    y: baseCoordinates.y + UIConstants.TILESIZE - 5,
  };
}
