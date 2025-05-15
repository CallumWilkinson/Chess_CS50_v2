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
    this.capturedPieces = {
      white: [],
      black: [],
    };
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
      throw new Error(
        `Not your turn. Only ${this.currentPlayerColour} can move.`
      );
    }

    if (!possibleMovesArray.includes(targetSquareName)) {
      throw new Error(
        `Invalid move: ${targetSquareName} is not a legal move for selected piece.`
      );
    }

    //check if there is a peice in the target square to assess a possible capture move
    if (this.board.grid[targetSquareName] != null) {
      const enemyPeice = this.board.grid[targetSquareName];
      //if an enemy peice was captured in this move, add it to the capturedPieces array for the correct player
      if (enemyPeice.colour != this.currentPlayerColour) {
        //go into the capturedpeices array for the current player, and add the chess peice that is at the targetSquare
        this.capturedPieces[this.currentPlayerColour].push(enemyPeice);
      }
    }

    //otherwise its a regular valid move so continue
    //move the piece in the grid
    this.board.grid[startSquareName] = null;
    this.board.grid[targetSquareName] = chessPiece;

    //update internal state of the peice to update the posistion associated with the peice
    //so that the grid knows where the peices are, and the peices also know where they are
    chessPiece.updateInternalMoveState(targetSquare);

    //switch turns
    this.switchTurn();

    //return true when move is sucessful
    return true;
  }

  endGame(winningPlayer) {
    this.gameStatus = GameStatus.CHECKMATE;
    this.winner = winningPlayer;
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
