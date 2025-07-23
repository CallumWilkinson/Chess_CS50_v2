//session manager class for managing game sessions and player connections
//consolidates the three global objects previously used in launchServer.js:
//gameSessions, connectedPlayers, and socketIDtoGameSessionID
//provides a game-agnostic networking layer for any turn-based game
export default class SessionManager {
  constructor() {
    //holds all game sessions, key is gameSessionID, value is GameSession object
    this.gameSessions = {};
    
    //holds every player connected to the server, key is socket.id, value is Player object
    this.connectedPlayers = {};
    
    //mapping of socket.id to gameSessionID for quick lookups
    //helps find a player's game session without searching all sessions
    this.socketIDtoGameSessionID = {};
  }

  //add a new player to the database when they connect
  addPlayer(socketId, playerObject) {
    this.connectedPlayers[socketId] = playerObject;
  }

  //remove a player from the database when they disconnect
  removePlayer(socketId) {
    delete this.connectedPlayers[socketId];
  }

  //add a game session to the session store
  //session creation logic should happen elsewhere, this just stores it
  addSession(gameSessionId, gameSessionObject) {
    this.gameSessions[gameSessionId] = gameSessionObject;
  }

  //remove a game session from the session store (used when session becomes empty)
  removeSession(gameSessionId) {
    delete this.gameSessions[gameSessionId];
  }

  //map a socket id to a specific game session for quick lookups
  mapSocketToSession(socketId, gameSessionId) {
    this.socketIDtoGameSessionID[socketId] = gameSessionId;
  }

  //remove the mapping between socket and session
  unmapSocketFromSession(socketId) {
    delete this.socketIDtoGameSessionID[socketId];
  }

  //get the game session id for a specific socket
  getSessionIdBySocket(socketId) {
    return this.socketIDtoGameSessionID[socketId];
  }

  //get a game session object by its id
  getSessionById(gameSessionId) {
    return this.gameSessions[gameSessionId];
  }

  //get a player object by socket id
  getPlayerBySocketId(socketId) {
    return this.connectedPlayers[socketId];
  }

  //get list of available games that have exactly 1 player waiting
  //returns array of game objects with session info for frontend display
  getAvailableGames() {
    const availableGames = [];

    //iterate through all game sessions
    for (const gameSessionID in this.gameSessions) {
      const playerCount = this.getPlayerCountInSession(gameSessionID);

      //only include games with exactly 1 player waiting
      if (playerCount === 1) {
        //find the waiting player's socket id
        let waitingPlayerSocketId = null;
        for (const socketId in this.socketIDtoGameSessionID) {
          if (this.socketIDtoGameSessionID[socketId] === gameSessionID) {
            waitingPlayerSocketId = socketId;
            break;
          }
        }

        //get the waiting player's info from connectedPlayers
        const waitingPlayer = this.connectedPlayers[waitingPlayerSocketId];
        
        //create game listing object
        //this is the data sent back to the client for displaying available games
        const gameInfo = {
          gameSessionID: gameSessionID,
          waitingPlayer: {
            username: waitingPlayer.username,
            colour: "black", //first player always gets black
          },
          playersConnected: playerCount,
          maxPlayers: 2,
        };

        availableGames.push(gameInfo);
      }
    }

    return availableGames;
  }

  //check if a game session exists
  sessionExists(gameSessionId) {
    return this.gameSessions[gameSessionId] !== undefined;
  }

  //get the number of players in a specific session
  getPlayerCountInSession(gameSessionId) {
    if (!this.sessionExists(gameSessionId)) {
      return 0;
    }
    //count how many sockets are mapped to this session
    let playerCount = 0;
    for (const socketId in this.socketIDtoGameSessionID) {
      if (this.socketIDtoGameSessionID[socketId] === gameSessionId) {
        playerCount++;
      }
    }
    return playerCount;
  }


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


  //get the players object for a specific session
  //returns the players object if session exists, null otherwise
  getPlayersInSession(sessionId) {
    //get the session object
    const session = this.getSessionById(sessionId);
    if (!session || !session.connectedPlayersSocketIDs || !session.connectedPlayersSocketIDs.players) {
      return null;
    }

    return session.connectedPlayersSocketIDs.players;
  }
}