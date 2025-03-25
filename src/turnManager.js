export class TurnManager {
  /**
   * @param {string} startingPlayer - startingPlayer colour "white" or "black"
   */
  constructor(startingPlayer) {
    this.currentPlayer = startingPlayer;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isWhiteTurn() {
    this.currentPlayer === "white";
    return this.currentPlayer;
  }

  isBlackTurn() {
    this.currentPlayer === "black";
    return this.currentPlayer;
  }

  switchTurn() {
    if (currentPlayer === "white") {
      currentPlayer = "black";
    } else {
      currentPlayer = "white";
    }
  }

  resetGame(startingPlayer = "white") {
    this.currentPlayer = startingPlayer;
  }
}
