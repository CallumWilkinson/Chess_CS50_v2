import { handleMove } from "../helpers/handleMove.js";
import GameSession from "./gameSession.js";
import Player from "./Player.js";
import SessionManager from "./SessionManager.js";
import { ChessConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Initialize the Socket.IO server with chess game event handlers
 * Sets up connection handling, game creation, joining, moves, and disconnections
 * @param {Object} io - Socket.IO server instance
 * @returns {Object} Socket ID to game session ID mapping for testing purposes
 */
export function launchServer(io) {
  //create session manager instance to manage game sessions and players
  //this will gradually replace the global objects below as we migrate the codebase
  const sessionManager = new SessionManager();

  //holds all game sessions, key is gameSessionID, contains game session objects that have the following values:
  //GameSessionID
  //connectedPlayersSocketIDs.players[{ username, colour }]
  //gameInstance
  const gameSessions = {};

  //this will hold every player that joins the server over a websocket(added on connection to the server)
  const connectedPlayers = {};

  //mapping of socket.id to the gameSessionID that the socket belongs to
  //helps quickly find a player's game session without searching all sessions
  const socketIDtoGameSessionID = {};

  //WHEN A NEW PLAYER CONNECTS TO THE SERVER DO THIS
  io.on("connection", (socket) => {
    //get username from clients auth handsake, if none default to guest
    const username = socket.handshake.auth.username || "Guest";

    //create a player object for this new connection
    const newPlayer = new Player(username, socket.id);

    //add this player to connectedPlayers object
    connectedPlayers[socket.id] = newPlayer;

    //also add to session manager for new move handling system
    sessionManager.addPlayer(socket.id, newPlayer);

    //send welcome message to newly connected client
    socket.emit("connected", {
      username,
      socketId: socket.id,
      message: "Connected to chess server",
    });

    //request list of available games to join
    socket.on("getAvailableGames", () => {
      const availableGames = getAvailableGamesForListing(gameSessions);
      //send all available games and data about each game back to the client
      //client can then display a list of all current games you can join
      socket.emit("availableGames", availableGames);
    });

    //create a new game session
    socket.on("createNewChessGame", () => {
      createNewSession(
        gameSessions,
        socketIDtoGameSessionID,
        socket,
        username,
        sessionManager
      );
    });

    //join a specific existing game session
    socket.on("joinExistingGame", (gameSessionID) => {
      joinExistingSession(
        gameSessionID,
        gameSessions,
        socketIDtoGameSessionID,
        socket,
        username,
        sessionManager
      );
    });

    //listen for a 'move' event from this client
    //using database API instead of directly accessing global objects
    //this decouples socket handling from game state manipulation
    socket.on("move", (jsonMoveData) => {
      handleMove(socket, jsonMoveData, sessionManager, io);
    });

    //handle disconnects
    socket.on("disconnect", () => {
      handleDisconnect(
        gameSessions,
        socketIDtoGameSessionID,
        socket,
        connectedPlayers
      );
    });
  });

  //return mapping for testing purposes
  return socketIDtoGameSessionID;
}

/**
 * Create a new game session for a player
 * Sets up the game instance, assigns colors, and initializes the chess board
 * @param {Object} gameSessions - Global game sessions object
 * @param {Object} socketIDtoGameSessionID - Socket to session mapping
 * @param {Object} socket - The socket connection creating the game
 * @param {string} username - Username of the player creating the game
 * @param {SessionManager} sessionManager - Session manager instance
 */
function createNewSession(
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  username,
  sessionManager
) {
  //create a new gameSession, which as a gameSession ID, knows which players are connected and has a fuction to make a gameInstance
  const newGameSession = new GameSession();

  //create gameInstance
  const newGameInstance = newGameSession.createGameInstance();

  //initialize chess game with board, game state manager, and pieces
  newGameInstance.createNewChessGame();

  //track players connected to this session
  //assign colour to the first player joining this session
  //connectedUsers is initially empty for new sessions, so first player gets black
  const assignedColour = newGameSession.getPlayerColour();

  //get gameSessionID
  const gameSessionID = newGameSession.gameSessionID;

  //store mapping between this socket and the new session
  socketIDtoGameSessionID[socket.id] = gameSessionID;

  //legacy compatibility: maintain connectedPlayersSocketIDs for backwards compatibility
  //TODO: remove this once all consumers migrate to connectedUsers
  newGameSession.connectedPlayersSocketIDs = { players: {} };
  newGameSession.connectedPlayersSocketIDs.players[socket.id] = {
    username,
    colour: assignedColour,
  };

  //add game session object to the sessions dictionary
  gameSessions[gameSessionID] = newGameSession;

  //also update session manager for new move handling system
  sessionManager.addSession(gameSessionID, newGameSession);
  sessionManager.mapSocketToSession(socket.id, gameSessionID);

  //update the player with the assigned colour and add to session
  const player = sessionManager.getPlayerBySocketId(socket.id);
  if (player) {
    player.setColour(assignedColour);
    newGameSession.addPlayerToSession(player);
  }

  //create a new "room" which is a group of sockets, and connect to it
  //the name of the room becomes the gameSessionID
  //the socket room is essentially the game lobby that the player joins
  //if there is no game with that ID this function makes a new room/lobby automatically
  socket.join(gameSessionID);

  //send a playerinfo message to the newly connected client, tell them their username, their color and the inital board state for them to uptdate their ui
  socket.emit("playerInfoAndInitialGameState", {
    username,
    colour: assignedColour,
    gameInstance: newGameInstance,
  });

  //console log in server terminal when a user connects
  console.log(`${username} connected to gameSessionID ${gameSessionID}`);
}

/**
 * Join an existing game session
 * Validates the session exists and isn't full, then adds the player
 * @param {string} gameSessionID - ID of the session to join
 * @param {Object} gameSessions - Global game sessions object
 * @param {Object} socketIDtoGameSessionID - Socket to session mapping
 * @param {Object} socket - The socket connection joining the game
 * @param {string} username - Username of the joining player
 * @param {SessionManager} sessionManager - Session manager instance
 */
function joinExistingSession(
  gameSessionID,
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  username,
  sessionManager
) {
  //check if game session actually exists first
  if (!gameSessions[gameSessionID]) {
    socket.emit("error", "Game session not found");
    return;
  }

  //check if game is already full using connectedUsers as single source of truth
  const selectedGameSession = gameSessions[gameSessionID];
  if (selectedGameSession.connectedUsers.length >= ChessConstants.MAX_PLAYERS) {
    socket.emit("error", "Game session is full");
    return;
  }

  //get the legacy players array for backwards compatibility
  const players = selectedGameSession.connectedPlayersSocketIDs.players;

  //assign this user's socket id and the game they selected to the mapping
  //this allows us in future to associate this user with this gameSession they are about to join
  socketIDtoGameSessionID[socket.id] = gameSessionID;

  //determines color for the joining player based on existing connected users
  const assignedColour = selectedGameSession.getPlayerColour();

  //legacy compatibility: assign username and colour to the player's socket.id in the gamesession
  //TODO: remove this once all consumers migrate to connectedUsers
  players[socket.id] = {
    username: username,
    colour: assignedColour,
  };

  //also update session manager for new move handling system
  sessionManager.mapSocketToSession(socket.id, gameSessionID);

  //update the player with the assigned colour and add to session
  const player = sessionManager.getPlayerBySocketId(socket.id);
  if (player) {
    player.setColour(assignedColour);
    selectedGameSession.addPlayerToSession(player);
  }

  //join an exisiting "socket room"
  socket.join(gameSessionID);

  //get the gameInstance that was previously made by the person who made the game previously
  const gameInstance = gameSessions[gameSessionID].gameInstance;

  //send a playerinfo message to the newly connected client, tell them their username, their color and the inital board state for them to uptdate their ui
  socket.emit("playerInfoAndInitialGameState", {
    username,
    colour: assignedColour,
    gameInstance,
  });

  //console log in server terminal when a user connects
  console.log(`${username} connected to gameSessionID ${gameSessionID}`);
}

/**
 * Handle player disconnection from the server
 * Cleans up session data and removes empty sessions to prevent memory leaks
 * @param {Object} gameSessions - Global game sessions object
 * @param {Object} socketIDtoGameSessionID - Socket to session mapping
 * @param {Object} socket - The disconnecting socket connection
 * @param {Object} connectedPlayers - Global connected players object
 */
export function handleDisconnect(
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  connectedPlayers
) {
  //find what session the player is in
  const gameSessionID = socketIDtoGameSessionID[socket.id];

  //remove from connected players
  delete connectedPlayers[socket.id];

  //get session data for the player
  const sessionData = gameSessions[gameSessionID];

  if (sessionData != null) {
    //find the player object in connectedUsers (single source of truth)
    const disconnectingPlayer = sessionData.connectedUsers.find(
      (p) => p.socketID === socket.id
    );

    if (disconnectingPlayer) {
      //get the username of the person disconnecting
      const playerUsername = disconnectingPlayer.username;

      //remove player from connectedUsers (single source of truth)
      sessionData.removePlayerFromSession(disconnectingPlayer);

      //legacy compatibility: also remove from old tracking system
      if (
        sessionData.connectedPlayersSocketIDs &&
        sessionData.connectedPlayersSocketIDs.players
      ) {
        delete sessionData.connectedPlayersSocketIDs.players[socket.id];
      }

      //check if session is now empty using connectedUsers and clean it up to prevent memory leak
      if (sessionData.connectedUsers.length === 0) {
        //no players left, delete the entire game session to free memory
        delete gameSessions[gameSessionID];
        console.log(
          `Game session ${gameSessionID} deleted - no players remaining`
        );
      }

      //remove stale mapping so reconnects work correctly
      delete socketIDtoGameSessionID[socket.id];

      //log disconnection to terminal
      console.log(
        `Player ${playerUsername} with socket id of ${socket.id} disconnected from gameSessionID ${gameSessionID}`
      );
    }
  }
}

/**
 * Get list of available games that have exactly 1 player waiting
 * Returns array of game objects with session info for frontend display
 * @param {Object} gameSessions - Global game sessions object
 * @returns {Object[]} Array of available game info objects for client display
 */
//get list of available games that have exactly 1 player waiting
//returns array of game objects with session info for frontend display
export function getAvailableGamesForListing(gameSessions) {
  const availableGames = [];

  //iterate through all game sessions
  for (const gameSessionID in gameSessions) {
    const gameSession = gameSessions[gameSessionID];
    const playerCount = gameSession.connectedUsers.length;

    //only include games with exactly 1 player waiting
    if (playerCount === 1) {
      //get the waiting player's info from connectedUsers (single source of truth)
      const waitingPlayer = gameSession.connectedUsers[0];

      //create game listing object for client display
      const gameInfo = {
        gameSessionID: gameSessionID,
        waitingPlayer: {
          username: waitingPlayer.username,
          colour: waitingPlayer.colour,
        },
        playersConnected: playerCount,
        maxPlayers: ChessConstants.MAX_PLAYERS,
      };

      availableGames.push(gameInfo);
    }
  }

  return availableGames;
}
