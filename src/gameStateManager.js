import { GameStatus } from "./constants.js";
import { TurnManager } from "./turnManager.js";
import ChessPiece from "./ChessPiece.js";

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
   * @param {Boolean} - returns true if move successful, used to check success status in the UI
   */

  //moves a chesspeice around in the dictionary to change the state of the board
  //switches player turn when the board state changes
  makeMove(chessPiece, targetSquare, possibleMovesArray) {
    //string to use key in grid
    const startSquareName = chessPiece.position.name;
    const targetSquareName = targetSquare.name;
    if (chessPiece.colour !== this.currentPlayerColour) {
      alert(`It is not your turn. Only ${this.currentPlayerColour} can move`);
      return;
    }

    if (!possibleMovesArray.includes(targetSquareName)) {
      alert(
        `Invalid move: ${targetSquareName} is not a legal move for select piece`
      );
      return;
    }
    //valid move so continue
    //move the piece in the grid
    //the position's name {string} is the key in dictionary
    this.board.grid[startSquareName] = null;
    this.board.grid[targetSquareName] = chessPiece;

    //update internal state of the peice to update the posistion associated with the peice
    //so that the grid knows where the peices are, and the peices also know where they are
    chessPiece.move(targetSquare, possibleMovesArray);

    //switch turns
    this.switchTurn();

    //return true when move is sucessful
    return true;
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
