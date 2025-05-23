export class TurnManager {
  /**
   * @param {string} currentPlayerColour - "white" or "black"
   */
  constructor(currentPlayerColour) {
    this.currentPlayerColour = currentPlayerColour;
  }

  switchTurn() {
    if (this.currentPlayerColour === "white") {
      this.currentPlayerColour = "black";
    } else {
      this.currentPlayerColour = "white";
    }

    return this.currentPlayerColour;
  }

  getCurrentPlayer() {
    return this.currentPlayerColour;
  }
}
