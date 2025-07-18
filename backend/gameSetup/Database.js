//database class for managing game sessions and player connections
//consolidates the three global objects previously used in launchServer.js:
//gameSessions, connectedPlayers, and socketIDtoGameSessionID
export default class Database {
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

  //create a new game session and store it in the database
  createSession(gameSessionId, gameSessionObject) {
    this.gameSessions[gameSessionId] = gameSessionObject;
  }

  //delete a game session from the database (used when session becomes empty)
  deleteSession(gameSessionId) {
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

  //assign a color to a new player based on existing players
  //takes a players object and returns either "black" or "white"
  //black is assigned first, then white if black is already taken
  assignPlayerColor(players) {
    //handle null or undefined players gracefully
    if (!players) {
      return "black";
    }

    //extract existing player colors from the players object
    const existingColors = Object.values(players).map((player) => player.colour);

    //assign white if black already exists, otherwise assign black
    if (existingColors.includes("black")) {
      return "white";
    } else {
      return "black";
    }
  }
}