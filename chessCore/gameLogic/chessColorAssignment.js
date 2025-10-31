/**
 * Chess-specific color assignment logic
 * Separates game rules from networking layer for better modularity
 * Assigns chess colors based on existing players in a session
 * First player gets black, second player gets white (traditional chess convention)
 * @param {Player[]|Object.<string, {colour: string}>|null} players - Array of player objects or object mapping player IDs to player objects with colour property
 * @returns {string|null} "black", "white", or null if both colors are taken
 */
export function assignChessColor(players) {
  // Test mode: Force specific color assignment
  if (process.env.TEST_FORCE_COLOR) {
    const forcedColor = process.env.TEST_FORCE_COLOR.toLowerCase();
    if (forcedColor === 'white' || forcedColor === 'black') {
      return forcedColor;
    }
  }

  if (!players) {
    return "black";
  }

  const existingColors = Object.values(players).map((player) => player.colour);

  const hasBlack = existingColors.includes("black");
  const hasWhite = existingColors.includes("white");
  
  if (hasBlack && hasWhite) {
    return null;
  }

  if (hasBlack) {
    return "white";
  } else {
    return "black";
  }
}

