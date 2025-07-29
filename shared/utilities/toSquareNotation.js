//NOTE THAT THERE ARE TWO COPIES OF THIS FILE AS I HAVE NOT SETUP A BUNDLER YET
//THIS IS TEMPORARY AND I WILL FIX IT

/**
 * Converts numeric indices back to standard chess notation.
 * this function is used in position.squareIsInLOS function, setupEventListeners, pawn class and the knight class
 *
 * @param {number} fileIndex - 0..7
 * @param {number} rankIndex - 0..7
 * @returns {string} Chess notation square (e.g. "e4").
 */
export function toSquareNotation(fileIndex, rankIndex) {
  // Convert 0..7 back to 'a'..'h'
  const fileChar = String.fromCharCode("a".charCodeAt(0) + fileIndex);
  // Convert 0..7 back to '1'..'8'
  const rankChar = (rankIndex + 1).toString();

  return fileChar + rankChar;
}

/**
 * Converts chess file letter to array index (a=0, b=1, etc.)
 * @param {string} squareName - Chess square notation (e.g., "e4", "a1")
 * @returns {number} File index (0-7)
 */
export function getFileIndex(squareName) {
  return squareName.charCodeAt(0) - "a".charCodeAt(0);
}

/**
 * Converts chess rank number to array index (1=0, 2=1, etc.) 
 * @param {string} squareName - Chess square notation (e.g., "e4", "a1")
 * @returns {number} Rank index (0-7)
 */
export function getRankIndex(squareName) {
  return parseInt(squareName[1], 10) - 1;
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
