//chess-specific color assignment logic
//separates game rules from networking layer for better modularity

//assigns chess colors based on existing players in a session
//first player gets black, second player gets white (traditional chess convention)
//returns "black" or "white" based on what's available
/**
 * @param {Object.<string, {colour: string}>|null} players - object mapping player IDs to player objects with colour property
 * @returns {string} "black" or "white" - the color to assign to the next player
 */
export function assignChessColor(players) {
  //handle null or undefined players gracefully
  if (!players) {
    return "black";
  }

  //extract existing player colors from the players object
  const existingColors = Object.values(players).map((player) => player.colour);

  //assign white if black already exists, otherwise assign black
  if (existingColors.includes("black")) {
    return "white";
  } else {
    return "black";
  }
}

//future: additional chess-specific game setup logic can go here
//example: validateChessGameSetup(), setupChessBoard(), etc.