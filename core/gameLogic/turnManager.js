/**
 * Manages turn switching logic for the chess game
 * Tracks the current player and handles alternating between white and black
 */
export class TurnManager {
  /**
   * @param {string} currentPlayerColour - "white" or "black"
   */
  constructor(currentPlayerColour) {
    this.currentPlayerColour = currentPlayerColour;
  }

  /**
   * Switch to the opposite player's turn
   * @returns {string} The new current player color ('white' or 'black')
   */
  switchTurn() {
    if (this.currentPlayerColour === "white") {
      this.currentPlayerColour = "black";
    } else {
      this.currentPlayerColour = "white";
    }

    return this.currentPlayerColour;
  }

  /**
   * Get the current player's color
   * @returns {string} Current player color ('white' or 'black')
   */
  getCurrentPlayer() {
    return this.currentPlayerColour;
  }
}
