import Board from "../../core/gameLogic/board.js";
import GameStateManager from "../../core/gameLogic/GameStateManager.js";

/**
 * Represents a single game instance within a session
 * Manages the game board, state, and game-specific logic
 */
export default class GameInstance {
  /**
   * Creates a new game instance
   * @param {string} gameInstanceID - Unique identifier for this game instance
   */
  constructor(gameInstanceID) {
    //a gameInstanceID is associated with each GameInstance
    this.gameInstanceID = gameInstanceID;
    //board instance will be created when game starts
    this.board;
    //game state manager handles turns, moves, and win conditions
    this.gameStateManager;
  }

  /**
   * Initialize a new chess game with board and pieces
   * Sets up the board state, game manager, and initial piece positions
   */
  createNewChessGame() {
    //create a board object and assign it to the browser window
    //board contains a dictionary where it's keys are the names of the squares on a chess board
    //the position of each chess peice in the dictionary is the 'under the hood' state of the board
    this.board = new Board();

    //create gameStateManager object with the first player being black
    //gameStateManager tracks the game status (winner/loser)
    //contains makeMove() function which moves peices around in the dictionary to change the state of the board
    //gameStateManager contains a turn manager that tracks who's turn it is
    this.gameStateManager = new GameStateManager(this.board, "black");

    //setup empty board, sets the keys of the dictionary to represent the squares of a chess board
    this.board.createEmptyBoard();

    //setup pieces in their default positions
    //the position of each peice in the dictionary is the 'under the hood' state of the board
    this.board.initialisePieces();
  }


  /**
   * Placeholder for future checkers game implementation
   * Example of how this GameInstance class can support multiple game types
   * @todo Implement checkers game logic
   */
  createNewCheckersGame() {}
}
