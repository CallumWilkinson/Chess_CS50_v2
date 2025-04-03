import { GameStatus } from "./constants";
import { TurnManager } from "./turnManager";
import ChessPiece from "./ChessPiece";

export default class GameStateManager {
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
    this.moveHistory = [];
    this.whiteTurnCount = 0;
    this.blackTurnCount = 0;
  }
  /**
   * @param {chessPiece} chessPiece - selected piece to be moved
   * @param {string} targetSquare - square to move to as a string
   * @param {Array} possibleMovesArray - return value of chessPiece.possibleMovesArray(), each child class has its own implementation of this function
   */

  makeMove(chessPiece, targetSquare, possibleMovesArray) {
    const startSquare = chessPiece.position;

    if (possibleMovesArray.includes(targetSquare)) {
      //move the piece in the grid
      this.board.grid[startSquare] = null;
      this.board.grid[targetSquare] = chessPiece;

      //update internal state of the peice
      chessPiece.move(targetSquare, possibleMovesArray);
    }
  }

  endGame(winningPlayer) {
    gameStatus = GameStatus.CHECKMATE;
    winner = winningPlayer;
  }

  resetGame(startingPlayer) {
    this.turnManager.resetTurn(startingPlayer);
    this.gameStatus = GameStatus.ONGOING;
    this.winner = null;
  }

  switchTurn() {
    this.currentPlayerColour = this.turnManager.switchTurn();
    if (this.currentPlayerColour == "black") {
      this.whiteTurnCount++;
    } else {
      this.blackTurnCount++;
    }
  }
}
