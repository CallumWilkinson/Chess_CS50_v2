import { GameStatus } from "./constants.js";
import { TurnManager } from "./turnManager.js";

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
   * @param {Position} targetSquare - position to move to
   * @param {Array} possibleMovesArray - ARRAY OF STRINGS return value of chessPiece.possibleMovesArray(), each child class has its own implementation of this function,
   */

  //moves a chesspeice around in the dictionary to change the state of the board
  //switches player turn when the board state changes
  makeMove(chessPiece, targetSquare, possibleMovesArray) {
    //string to use key in grid
    const startSquareName = chessPiece.position.name;
    const targetSquareName = targetSquare.name;

    if (possibleMovesArray.includes(targetSquareName)) {
      //move the piece in the grid
      //the position's name {string} is the key in dictionary
      this.board.grid[startSquareName] = null;
      this.board.grid[targetSquareName] = chessPiece;

      //update internal state of the peice
      chessPiece.move(targetSquare, possibleMovesArray);

      //switch turns
      this.switchTurn();
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
