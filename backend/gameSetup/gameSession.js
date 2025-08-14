import GameInstance from "./GameInstance.js";
import { assignChessColor } from "../gameLogic/chessColorAssignment.js";
import { SystemConstants } from "../../shared/utilities/gameConstants.js";

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
    //random game session identifier
    this.gameSessionID = Math.random().toString(SystemConstants.RANDOM_STRING_RADIX).slice(SystemConstants.RANDOM_STRING_START, SystemConstants.RANDOM_STRING_END);
    //single source of truth for connected players
    this.connectedUsers = [];
    //set when createGameInstance() is called
    this.gameInstance;
  }

  /**
   * Create a new game instance within this session
   * @returns {GameInstance} The newly created game instance
   */
  createGameInstance() {
    //random game instance identifier
    const gameInstanceID = Math.random().toString(SystemConstants.RANDOM_STRING_RADIX).slice(SystemConstants.RANDOM_STRING_START, SystemConstants.RANDOM_STRING_END);

    const gameInstance = new GameInstance(gameInstanceID);
    this.gameInstance = gameInstance;
    return gameInstance;
  }

  /**
   * Add a player to this game session
   * @param {Player} player - The player instance to add
   */
  addPlayerToSession(player) {
    this.connectedUsers.push(player);
  }

  /**
   * Remove a player from this game session
   * @param {Player} player - The player instance to remove
   */
  removePlayerFromSession(player) {
    const index = this.connectedUsers.findIndex(p => p.socketID === player.socketID);
    if (index !== -1) {
      this.connectedUsers.splice(index, SystemConstants.SINGLE_ITEM_REMOVAL);
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
  getPlayerColour() {
    return assignChessColor(this.connectedUsers);
  }
}
