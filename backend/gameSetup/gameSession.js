import GameInstance from "./GameInstance.js";
import { assignChessColor } from "../../chessCore/gameLogic/chessColorAssignment.js";
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
    //random game session identifier (or test deterministic ID)
    if (process.env.TEST_SESSION) {
      this.gameSessionID = process.env.TEST_SESSION;
    } else {
      this.gameSessionID = Math.random().toString(SystemConstants.RANDOM_STRING_RADIX).slice(SystemConstants.RANDOM_STRING_START, SystemConstants.RANDOM_STRING_END);
    }
    //single source of truth for connected players
    this.connectedUsers = [];
    //set when createGameInstance() is called
    this.gameInstance;

    //optional host-selected preferred colour for the first player to join this session
    this.hostPreferredColour = null;
    this.lobbyName = null;
  }

  /**
   * Create a new game instance within this session
   * @returns {GameInstance} The newly created game instance
   */
  createGameInstance() {
    //random game instance identifier (or test deterministic ID)
    let gameInstanceID;
    if (process.env.TEST_SESSION) {
      gameInstanceID = `${process.env.TEST_SESSION}-instance`;
    } else {
      gameInstanceID = Math.random().toString(SystemConstants.RANDOM_STRING_RADIX).slice(SystemConstants.RANDOM_STRING_START, SystemConstants.RANDOM_STRING_END);
    }

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
    if (
      Array.isArray(this.connectedUsers) &&
      this.connectedUsers.length === 0 &&
      (this.hostPreferredColour === "white" || this.hostPreferredColour === "black")
    ) {
      return this.hostPreferredColour;
    }

    return assignChessColor(this.connectedUsers);
  }
}
