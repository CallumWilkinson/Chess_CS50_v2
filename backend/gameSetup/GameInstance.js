import Board from "../gameLogic/board.js";
import GameStateManager from "../gameLogic/GameStateManager.js";

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
    //legacy array - use GameSession.connectedUsers instead
    this.players = [];
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
   * Legacy method for adding players to instance - now handled by GameSession
   * Database color assignment is no longer supported - color assignment moved to GameSession
   * This method now only handles the legacy fallback logic
   * @param {Object} connectedUsers - Object containing connected user data
   * @param {Object|null} database - Legacy parameter, no longer used
   * @returns {string} The assigned color ('black' or 'white')
   * @deprecated Use GameSession.addPlayerToSession instead
   */
  addPlayersToInstance(connectedUsers, database = null) { // eslint-disable-line no-unused-vars
    //database color assignment is no longer supported - color assignment moved to GameSession
    //this method now only handles the legacy fallback logic

    //fallback to legacy logic for backwards compatibility
    //assign new player a colour based on the currently connected players
    const colours = Object.values(connectedUsers).map((p) => p.colour);

    //if black is taken, assign white to new player, otherwise assign black so that black is always player 1
    let assignedColour;

    if (colours.includes("black")) {
      assignedColour = "white";
    } else {
      assignedColour = "black";
    }
    return assignedColour;
  }

  /**
   * Placeholder for future checkers game implementation
   * Example of how this GameInstance class can support multiple game types
   * @todo Implement checkers game logic
   */
  //im not going to actually make a checkers game yet but this is just an example, like with this gameInstance class i can create games inside it
  createNewCheckersGame() {}
}
