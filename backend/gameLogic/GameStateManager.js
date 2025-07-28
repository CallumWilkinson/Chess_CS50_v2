import { GameStatus } from "../../shared/utilities/constants.js";
import { TurnManager } from "./turnManager.js";

/**
 * Manages the overall state of a chess game
 * Handles moves, turn switching, game status, and captured pieces
 * Acts as the main controller for game logic and rule enforcement
 */
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
    this.whiteTurnCount = 0;
    this.blackTurnCount = 0;
    this.capturedPieces = {
      white: [],
      black: [],
    };
  }
  /**
   * Execute a chess move and update game state
   * Validates the move, handles captures, updates board, and switches turns
   * @param {ChessPiece} chessPiece - The piece to be moved
   * @param {Position} targetSquare - The destination square
   * @param {string[]} possibleMovesArray - Array of valid move squares for this piece
   * @returns {boolean} True if move successful, used to check success status in the UI
   * @throws {Error} If move is invalid (not player's turn, illegal move, friendly fire)
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

    //stop if target square holds a friendly piece, this stops friendly fire so you cant capture your own peice
    if (
      this.board.grid[targetSquareName] &&
      this.board.grid[targetSquareName].colour === this.currentPlayerColour
    ) {
      throw new Error("Invalid move: cannot capture your own piece.");
    }

    //if target square contains an enemy peice, capture it
    if (this.board.grid[targetSquareName] != null) {
      const enemyPeice = this.board.grid[targetSquareName];
      //if an enemy peice was captured in this move, add it to the capturedPieces array for the correct player
      if (enemyPeice.colour != this.currentPlayerColour) {
        //go into the capturedpeices array for the current player, and add the chess peice that is at the targetSquare
        this.capturedPieces[this.currentPlayerColour].push(enemyPeice);
      }
    }

    //otherwise its a regular valid move into an empty square
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

  /**
   * Switch to the next player's turn and update turn counters
   * Uses TurnManager to handle the color switch logic
   */
  switchTurn() {
    this.currentPlayerColour = this.turnManager.switchTurn();
    //increment turn counter for the player who just finished their turn
    if (this.currentPlayerColour == "black") {
      this.whiteTurnCount++;
    } else {
      this.blackTurnCount++;
    }
  }

  /**
   * End the game with a winner (checkmate scenario)
   * @param {string} winningPlayer - The color of the winning player ('white' or 'black')
   */
  endGame(winningPlayer) {
    this.winner = winningPlayer;
    this.gameStatus = GameStatus.CHECKMATE;
  }
}
