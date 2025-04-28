/**
 * Converts numeric indices back to standard chess notation.
 * this function is used in position.squareIsInLOS function, and pawn.getPossibleMoves()
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
