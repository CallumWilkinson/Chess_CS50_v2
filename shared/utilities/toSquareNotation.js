//NOTE THAT THERE ARE TWO COPIES OF THIS FILE AS I HAVE NOT SETUP A BUNDLER YET
//THIS IS TEMPORARY AND I WILL FIX IT

import { CoordinateConstants } from "./gameConstants.js";

/**
 * Converts numeric indices back to standard chess notation.
 * this function is used in position.squareIsInLOS function, setupEventListeners, pawn class and the knight class
 *
 * @param {number} fileIndex - File index (0-based)
 * @param {number} rankIndex - Rank index (0-based)
 * @returns {string} Chess notation square (e.g. "e4").
 */
export function toSquareNotation(fileIndex, rankIndex) {
  // Convert file index back to file letter
  const fileChar = String.fromCharCode(CoordinateConstants.ASCII_FILE_A + fileIndex);
  // Convert rank index back to rank number
  const rankChar = (rankIndex + CoordinateConstants.RANK_INDEX_OFFSET).toString();

  return fileChar + rankChar;
}

/**
 * Converts chess file letter to array index (a=0, b=1, etc.)
 * @param {string} squareName - Chess square notation (e.g., "e4", "a1")
 * @returns {number} File index (0-based)
 */
export function getFileIndex(squareName) {
  return squareName.charCodeAt(0) - CoordinateConstants.ASCII_FILE_A;
}

/**
 * Converts chess rank number to array index (1=0, 2=1, etc.) 
 * @param {string} squareName - Chess square notation (e.g., "e4", "a1")
 * @returns {number} Rank index (0-based)
 */
export function getRankIndex(squareName) {
  return parseInt(squareName[1], 10) - CoordinateConstants.RANK_INDEX_OFFSET;
}

/**
 * Determines if a chess square is a light square (white)
 * Light squares occur when the sum of row and column indices is even
 * @param {string} squareName - Chess square notation (e.g., "e4", "a1")
 * @returns {boolean} True if light square, false if dark square
 */
export function isLightSquare(squareName) {
  const row = getRankIndex(squareName);
  const col = getFileIndex(squareName);
  return (row + col) % 2 === 0;
}
