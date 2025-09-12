import { ChessConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Session manager class for managing game sessions and player connections
 * Consolidates the three global objects previously used in launchServer.js:
 * gameSessions, connectedPlayers, and socketIDtoGameSessionID
 * Provides a game-agnostic networking layer for any turn-based game
 */
export default class SessionManager {
  /**
   * Creates a new SessionManager instance
   */
  constructor() {
    //key: gameSessionID, value: GameSession object
    this.gameSessions = {};

    //key: socket.id, value: Player object
    this.connectedPlayers = {};

    //mapping of socket.id to gameSessionID for quick lookups
    this.socketIDtoGameSessionID = {};

    //mapping of canonical lobby names to session IDs for unique lobby indexing
    //acts as a simple in-memory index to support create/join flows by name
    this.lobbyNameToSessionID = new Map();
  }

  /**
   * Add a new player to the database when they connect
   * @param {string} socketId - The socket ID of the connecting player
   * @param {Player} playerObject - The Player instance to store
   */
  addPlayer(socketId, playerObject) {
    this.connectedPlayers[socketId] = playerObject;
  }

  /**
   * Remove a player from the database when they disconnect
   * @param {string} socketId - The socket ID of the disconnecting player
   */
  removePlayer(socketId) {
    delete this.connectedPlayers[socketId];
  }

  /**
   * Add a game session to the session store
   * Session creation logic should happen elsewhere, this just stores it
   * @param {string} gameSessionId - Unique identifier for the game session
   * @param {GameSession} gameSessionObject - The GameSession instance to store
   */
  //stores session - creation logic handled by caller
  addSession(gameSessionId, gameSessionObject) {
    this.gameSessions[gameSessionId] = gameSessionObject;
  }

  /**
   * Remove a game session from the session store (used when session becomes empty)
   * @param {string} gameSessionId - The ID of the session to remove
   */
  removeSession(gameSessionId) {
    delete this.gameSessions[gameSessionId];
  }

  /**
   * Map a socket id to a specific game session for quick lookups
   * @param {string} socketId - The socket ID to map
   * @param {string} gameSessionId - The game session ID to map to
   */
  mapSocketToSession(socketId, gameSessionId) {
    this.socketIDtoGameSessionID[socketId] = gameSessionId;
  }

  /**
   * Remove the mapping between socket and session
   * @param {string} socketId - The socket ID to unmap
   */
  unmapSocketFromSession(socketId) {
    delete this.socketIDtoGameSessionID[socketId];
  }

  /**
   * Get the game session id for a specific socket
   * @param {string} socketId - The socket ID to look up
   * @returns {string|undefined} The game session ID, or undefined if not found
   */
  getSessionIdBySocket(socketId) {
    return this.socketIDtoGameSessionID[socketId];
  }

  /**
   * Get a game session object by its id
   * @param {string} gameSessionId - The session ID to look up
   * @returns {GameSession|undefined} The GameSession object, or undefined if not found
   */
  getSessionById(gameSessionId) {
    return this.gameSessions[gameSessionId];
  }

  /**
   * Get a player object by socket id
   * @param {string} socketId - The socket ID to look up
   * @returns {Player|undefined} The Player object, or undefined if not found
   */
  getPlayerBySocketId(socketId) {
    return this.connectedPlayers[socketId];
  }

  /**
   * Get list of available games that have exactly 1 player waiting
   * Returns array of game objects with session info for frontend display
   * @returns {Object[]} Array of game info objects for display
   */
  //returns array of games with exactly 1 player waiting for frontend display
  getAvailableGames() {
    const availableGames = [];

    for (const gameSessionID in this.gameSessions) {
      const session = this.gameSessions[gameSessionID];
      const playerCount = session.connectedUsers.length;

      //only include games with exactly 1 player waiting
      if (playerCount === 1) {
        const waitingPlayer = session.connectedUsers[0];

        //data sent to client for displaying available games
        const gameInfo = {
          gameSessionID: gameSessionID,
          waitingPlayer: {
            username: waitingPlayer.username,
            colour: waitingPlayer.colour,
          },
          playersConnected: playerCount,
          maxPlayers: ChessConstants.MAX_PLAYERS,
        };

        //include lobbyName only when present to maintain backward-compatible tests
        if (session.lobbyName) {
          gameInfo.lobbyName = session.lobbyName;
        }

        availableGames.push(gameInfo);
      }
    }

    return availableGames;
  }

  /**
   * Check if a game session exists
   * @param {string} gameSessionId - The session ID to check
   * @returns {boolean} True if session exists, false otherwise
   */
  sessionExists(gameSessionId) {
    return this.gameSessions[gameSessionId] !== undefined;
  }

  /**
   * Get the number of players in a specific session using connectedUsers as single source of truth
   * @param {string} gameSessionId - The session ID to check
   * @returns {number} Number of connected players in the session
   */
  //uses connectedUsers as single source of truth
  getPlayerCountInSession(gameSessionId) {
    const session = this.getSessionById(gameSessionId);
    if (!session || !session.connectedUsers) {
      return 0;
    }
    return session.connectedUsers.length;
  }

  /**
   * Get game instance for a specific socket id
   * Returns the game instance if socket is mapped to a valid session, null otherwise
   * @param {string} socketId - The socket ID to look up
   * @returns {GameInstance|null} The GameInstance object, or null if not found
   */
  getGameInstanceBySocket(socketId) {
    const sessionId = this.getSessionIdBySocket(socketId);
    if (!sessionId) {
      return null;
    }

    const session = this.getSessionById(sessionId);
    if (!session || !session.gameInstance) {
      return null;
    }

    return session.gameInstance;
  }

  /**
   * Get the players array for a specific session using connectedUsers as single source of truth
   * Returns the connectedUsers array if session exists, null otherwise
   * @param {string} sessionId - The session ID to look up
   * @returns {Player[]|null} Array of connected players, or null if session not found
   */
  //uses connectedUsers as single source of truth
  getPlayersInSession(sessionId) {
    const session = this.getSessionById(sessionId);
    if (!session || !session.connectedUsers) {
      return null;
    }

    return session.connectedUsers;
  }

  /**
   * Determine if a lobby name is available (and valid) for registration
   * @param {string} name - Proposed lobby name
   * @returns {boolean} true if valid and not taken, false otherwise
   */
  isLobbyNameAvailable(name) {
    const canonical = this.#canonicalizeLobbyName(name);
    if (!this.#isValidLobbyName(canonical)) {
      return false;
    }
    return !this.lobbyNameToSessionID.has(canonical);
  }

  /**
   * Register a lobby name to point at a session ID (no-op if invalid or taken)
   * @param {string} name - Lobby name to register
   * @param {string} sessionId - Associated session ID
   * @returns {boolean} true if registration succeeded
   */
  registerLobbyName(name, sessionId) {
    const canonical = this.#canonicalizeLobbyName(name);
    if (!this.#isValidLobbyName(canonical)) {
      return false;
    }
    if (this.lobbyNameToSessionID.has(canonical)) {
      return false;
    }
    this.lobbyNameToSessionID.set(canonical, sessionId);
    return true;
  }

  /**
   * Unregister a lobby name (free it for reuse)
   * @param {string} name - Lobby name to remove
   */
  unregisterLobbyName(name) {
    const canonical = this.#canonicalizeLobbyName(name);
    this.lobbyNameToSessionID.delete(canonical);
  }

  /**
   * Look up a session ID by lobby name
   * @param {string} name - Lobby name to look up
   * @returns {string|undefined} session ID if found
   */
  findSessionIdByLobbyName(name) {
    const canonical = this.#canonicalizeLobbyName(name);
    return this.lobbyNameToSessionID.get(canonical);
  }

  //normalize names for unique indexing: trim, collapse internal spaces, lowercase
  #canonicalizeLobbyName(name) {
    if (typeof name !== "string") {
      return "";
    }
    const trimmed = name.trim().replace(/\s+/g, " ");
    return trimmed.toLowerCase();
  }

  //validate canonical name against business rules
  #isValidLobbyName(canonical) {
    if (!canonical) {
      return false;
    }
    if (canonical.length < 3 || canonical.length > 24) {
      return false;
    }
    //allow a-z, 0-9, space and dash only
    return /^[a-z0-9 -]+$/.test(canonical);
  }
}
