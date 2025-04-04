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
    if (this.currentPlayerColour === "white") {
      return true;
    }
    return false;
  }

  isBlackTurn() {
    if (this.currentPlayerColour === "black") {
      return true;
    }
    return false;
  }

  switchTurn() {
    if (this.currentPlayerColour === "white") {
      this.currentPlayerColour = "black";
    } else {
      this.currentPlayerColour = "white";
    }
    return this.currentPlayerColour;
  }

  /**
   * @param {string} startingPlayer - startingPlayer colour "white" or "black"
   */
  resetTurn(startingPlayer) {
    this.currentPlayerColour = startingPlayer;
  }
}
