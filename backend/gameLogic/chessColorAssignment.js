/**
 * Chess-specific color assignment logic
 * Separates game rules from networking layer for better modularity
 * Assigns chess colors based on existing players in a session
 * First player gets black, second player gets white (traditional chess convention)
 * @param {Player[]|Object.<string, {colour: string}>|null} players - Array of player objects or object mapping player IDs to player objects with colour property
 * @returns {string|null} "black", "white", or null if both colors are taken
 */
export function assignChessColor(players) {
  //handle null or undefined players gracefully
  if (!players) {
    return "black";
  }

  //extract existing player colors from the players object
  const existingColors = Object.values(players).map((player) => player.colour);

  //check if game is full (both colors taken)
  const hasBlack = existingColors.includes("black");
  const hasWhite = existingColors.includes("white");
  
  if (hasBlack && hasWhite) {
    return null; //game is full, no colors available
  }

  //assign white if black already exists, otherwise assign black
  if (hasBlack) {
    return "white";
  } else {
    return "black";
  }
}

//future: additional chess-specific game setup logic can go here
//example: validateChessGameSetup(), setupChessBoard(), etc.