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
