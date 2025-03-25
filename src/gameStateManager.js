import { GameStatus } from "./constants";

export default class gameStateManager {
  /**
   * @param {Board} board - An instance of Board class.
   * @param {string} currentPlayerColour - currentPlayer colour "white" or "black"
   */
  constructor(board, currentPlayerColour) {
    this.board = board;
    this.currentPlayerColour = currentPlayerColour;
    this.gameStatus = GameStatus.ONGOING; // 'ongoing', 'checkmate', 'stalemate', 'draw'
    this.winner = null;
    this.turnManager = new TurnManager(currentPlayerColour);
  }

  makeMove() {}

  endGame(winningPlayer) {
    gameStatus = GameStatus.CHECKMATE;
    winner = winningPlayer;
  }

  resetGame() {}
}
