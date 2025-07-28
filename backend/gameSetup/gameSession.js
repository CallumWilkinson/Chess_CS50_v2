import GameInstance from "./GameInstance.js";
import { assignChessColor } from "../gameLogic/chessColorAssignment.js";

/**
 * Represents a game session that manages players and game instances
 * Acts as a container for a single game with its connected players
 * Handles player management and delegates to GameInstance for game logic
 */
export default class GameSession {
  /**
   * Creates a new game session with a random ID
   */
  constructor() {
    //generate a 6 character random id (letters and numbers)
    //tostring(36) is base 36 so letters are included
    //slice makes it 6 chars long
    this.gameSessionID = Math.random().toString(36).slice(2, 8);
    //a user belongs to the game session, but a player belongs to the gameInstance
    //this is the single source of truth for connected players
    this.connectedUsers = [];
    //this is set when you run gamesession.createGameInstance()
    this.gameInstance;
  }

  /**
   * Create a new game instance within this session
   * @returns {GameInstance} The newly created game instance
   */
  createGameInstance() {
    //generate a 6 character random id (letters and numbers)
    //tostring(36) is base 36 so letters are included
    //slice makes it 6 chars long
    const gameInstanceID = Math.random().toString(36).slice(2, 8);

    //create a new game instance inside this session
    const gameInstance = new GameInstance(gameInstanceID);

    this.gameInstance = gameInstance;
    return gameInstance;
  }

  /**
   * Add a player to this game session
   * @param {Player} player - The player instance to add
   */
  addPlayerToSession(player) {
    //add player to connectedUsers to maintain single source of truth
    this.connectedUsers.push(player);
  }

  /**
   * Remove a player from this game session
   * @param {Player} player - The player instance to remove
   */
  removePlayerFromSession(player) {
    //remove player from connectedUsers when they disconnect
    const index = this.connectedUsers.findIndex(p => p.socketID === player.socketID);
    if (index !== -1) {
      this.connectedUsers.splice(index, 1);
    }
  }

  /**
   * Get the appropriate color for a new player joining this session
   * Abstraction layer for color assignment - uses internal connectedUsers as single source of truth
   * Delegates to chess-specific logic but could be extended for other game types
   * This keeps networking/session code separate from game-specific rules
   * Uses chess rules: first player black, second player white
   * @returns {string|null} The assigned color ('black', 'white') or null if game is full
   */
  //abstraction layer for color assignment - uses internal connectedUsers as single source of truth
  //delegates to chess-specific logic but could be extended for other game types
  //this keeps networking/session code separate from game-specific rules
  //uses chess rules: first player black, second player white
  getPlayerColour() {
    return assignChessColor(this.connectedUsers);
  }
}
