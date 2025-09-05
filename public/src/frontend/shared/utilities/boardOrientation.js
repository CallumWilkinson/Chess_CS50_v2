/**
 * Determines if the board should be flipped based on player color
 * We want the UI to show the current player's colour at the bottom, and the enemy player colour at the top
 * @param {string} playerColour - Player's piece color
 * @returns {boolean} True if board should be flipped (white player), false otherwise
 */
export function shouldFlipBoard(playerColour) {
  return playerColour === "white";
}

/**
 * Transforms board coordinates based on player perspective so the player sees their pieces on the bottom
 * @param {number} rankIndex - Original rank index (0-7)
 * @param {number} fileIndex - Original file index (0-7)
 * @param {string} playerColour - Player's piece color
 * @returns {{rank: number, file: number}} Transformed coordinates for player perspective
 */
export function transformCoordinatesForPlayer(
  rankIndex,
  fileIndex,
  playerColour
) {
  if (shouldFlipBoard(playerColour)) {
    return {
      rank: 7 - rankIndex,
      file: 7 - fileIndex,
    };
  }

  return {
    rank: rankIndex,
    file: fileIndex,
  };
}
