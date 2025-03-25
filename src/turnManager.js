export class TurnManager {
  /**
   * @param {string} currentPlayerColour - startingPlayer colour "white" or "black"
   */
  constructor(currentPlayerColour) {
    this.currentPlayerColour = currentPlayerColour;
  }

  getCurrentPlayer() {
    return this.currentPlayerColour;
  }

  isWhiteTurn() {
    this.currentPlayerColour === "white";
    return this.currentPlayerColour;
  }

  isBlackTurn() {
    this.currentPlayerColour === "black";
    return this.currentPlayerColour;
  }

  switchTurn() {
    if (this.currentPlayerColour === "white") {
      this.currentPlayerColour = "black";
    } else {
      this.currentPlayerColour = "white";
    }
  }

  /**
   * @param {string} startingPlayer - startingPlayer colour "white" or "black"
   */
  resetTurn(startingPlayer) {
    this.currentPlayerColour = startingPlayer;
  }
}
