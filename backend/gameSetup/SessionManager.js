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
    //holds all game sessions, key is gameSessionID, value is GameSession object
    this.gameSessions = {};
    
    //holds every player connected to the server, key is socket.id, value is Player object
    this.connectedPlayers = {};
    
    //mapping of socket.id to gameSessionID for quick lookups
    //helps find a player's game session without searching all sessions
    this.socketIDtoGameSessionID = {};
  }

  /**
   * Add a new player to the database when they connect
   * @param {string} socketId - The socket ID of the connecting player
   * @param {Player} playerObject - The Player instance to store
   */
  //add a new player to the database when they connect
  addPlayer(socketId, playerObject) {
    this.connectedPlayers[socketId] = playerObject;
  }

  /**
   * Remove a player from the database when they disconnect
   * @param {string} socketId - The socket ID of the disconnecting player
   */
  //remove a player from the database when they disconnect
  removePlayer(socketId) {
    delete this.connectedPlayers[socketId];
  }

  /**
   * Add a game session to the session store
   * Session creation logic should happen elsewhere, this just stores it
   * @param {string} gameSessionId - Unique identifier for the game session
   * @param {GameSession} gameSessionObject - The GameSession instance to store
   */
  //add a game session to the session store
  //session creation logic should happen elsewhere, this just stores it
  addSession(gameSessionId, gameSessionObject) {
    this.gameSessions[gameSessionId] = gameSessionObject;
  }

  /**
   * Remove a game session from the session store (used when session becomes empty)
   * @param {string} gameSessionId - The ID of the session to remove
   */
  //remove a game session from the session store (used when session becomes empty)
  removeSession(gameSessionId) {
    delete this.gameSessions[gameSessionId];
  }

  /**
   * Map a socket id to a specific game session for quick lookups
   * @param {string} socketId - The socket ID to map
   * @param {string} gameSessionId - The game session ID to map to
   */
  //map a socket id to a specific game session for quick lookups
  mapSocketToSession(socketId, gameSessionId) {
    this.socketIDtoGameSessionID[socketId] = gameSessionId;
  }

  /**
   * Remove the mapping between socket and session
   * @param {string} socketId - The socket ID to unmap
   */
  //remove the mapping between socket and session
  unmapSocketFromSession(socketId) {
    delete this.socketIDtoGameSessionID[socketId];
  }

  /**
   * Get the game session id for a specific socket
   * @param {string} socketId - The socket ID to look up
   * @returns {string|undefined} The game session ID, or undefined if not found
   */
  //get the game session id for a specific socket
  getSessionIdBySocket(socketId) {
    return this.socketIDtoGameSessionID[socketId];
  }

  /**
   * Get a game session object by its id
   * @param {string} gameSessionId - The session ID to look up
   * @returns {GameSession|undefined} The GameSession object, or undefined if not found
   */
  //get a game session object by its id
  getSessionById(gameSessionId) {
    return this.gameSessions[gameSessionId];
  }

  /**
   * Get a player object by socket id
   * @param {string} socketId - The socket ID to look up
   * @returns {Player|undefined} The Player object, or undefined if not found
   */
  //get a player object by socket id
  getPlayerBySocketId(socketId) {
    return this.connectedPlayers[socketId];
  }

  /**
   * Get list of available games that have exactly 1 player waiting
   * Returns array of game objects with session info for frontend display
   * @returns {Object[]} Array of game info objects for display
   */
  //get list of available games that have exactly 1 player waiting
  //returns array of game objects with session info for frontend display
  getAvailableGames() {
    const availableGames = [];

    //iterate through all game sessions
    for (const gameSessionID in this.gameSessions) {
      const session = this.gameSessions[gameSessionID];
      const playerCount = session.connectedUsers.length;

      //only include games with exactly 1 player waiting
      if (playerCount === 1) {
        //get the waiting player's info from connectedUsers (single source of truth)
        const waitingPlayer = session.connectedUsers[0];
        
        //create game listing object
        //this is the data sent back to the client for displaying available games
        const gameInfo = {
          gameSessionID: gameSessionID,
          waitingPlayer: {
            username: waitingPlayer.username,
            colour: waitingPlayer.colour,
          },
          playersConnected: playerCount,
          maxPlayers: 2,
        };

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
  //check if a game session exists
  sessionExists(gameSessionId) {
    return this.gameSessions[gameSessionId] !== undefined;
  }

  /**
   * Get the number of players in a specific session using connectedUsers as single source of truth
   * @param {string} gameSessionId - The session ID to check
   * @returns {number} Number of connected players in the session
   */
  //get the number of players in a specific session using connectedUsers as single source of truth
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
  //get game instance for a specific socket id
  //returns the game instance if socket is mapped to a valid session, null otherwise
  getGameInstanceBySocket(socketId) {
    //get the session id for this socket
    const sessionId = this.getSessionIdBySocket(socketId);
    if (!sessionId) {
      return null;
    }

    //get the session object
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
  //get the players array for a specific session using connectedUsers as single source of truth
  //returns the connectedUsers array if session exists, null otherwise
  getPlayersInSession(sessionId) {
    //get the session object
    const session = this.getSessionById(sessionId);
    if (!session || !session.connectedUsers) {
      return null;
    }

    return session.connectedUsers;
  }
}