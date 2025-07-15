import { handleMove } from "../helpers/handleMove.js";
import GameSession from "./gameSession.js";
import Player from "./player.js";

export function launchServer(io) {
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
      createNewSession(gameSessions, socketIDtoGameSessionID, socket, username);
    });

    //join a specific existing game session
    socket.on("joinExistingGame", (gameSessionID) => {
      joinExistingSession(
        gameSessionID,
        gameSessions,
        socketIDtoGameSessionID,
        socket,
        username
      );
    });

    //listen for a 'move' event from this client
    //i feel like its wrong to pass the whole server object here jsut so i can called server.to(roomID).emit()?
    //i think this function should belong to the session class?
    socket.on("move", (jsonMoveData) => {
      handleMove(
        socket,
        jsonMoveData,
        gameSessions,
        socketIDtoGameSessionID,
        io
      );
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

function createNewSession(
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  username
) {
  //create a new gameSession, which as a gameSession ID, knows which players are connected and has a fuction to make a gameInstance
  const newGameSession = new GameSession();

  //create gameInstance
  const newGameInstance = newGameSession.createGameInstance();

  //create a chess game inside the instance, this function creates the board, the gamestatemanager and all the chess peices
  //the game is now setup like a normal chess board
  newGameInstance.createNewChessGame();

  //track players connected to this session
  //do i need this? cant i just use the connectedPlayers object?
  const players = {};

  //assign colour to the first player joining this session, players should be blank before passing object to this function as its a new game
  const assignedColour = newGameSession.getPlayerColour(players);

  //get gameSessionID
  const gameSessionID = newGameSession.gameSessionID;

  //store mapping between this socket and the new session
  socketIDtoGameSessionID[socket.id] = gameSessionID;

  //attach player info to the session object
  newGameSession.connectedPlayersSocketIDs = { players };
  newGameSession.connectedPlayersSocketIDs.players[socket.id] = {
    username,
    colour: assignedColour,
  };

  //add game session object to the sessions dictionary
  gameSessions[gameSessionID] = newGameSession;

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

function joinExistingSession(
  gameSessionID,
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  username
) {
  //check if game session actually exists first
  if (!gameSessions[gameSessionID]) {
    socket.emit("error", "Game session not found");
    return;
  }

  //get the players array so we know if anyone has already connected, this is needed as the second player to join is always white and the first is black
  const players = gameSessions[gameSessionID].connectedPlayersSocketIDs.players;

  //check if game is already full (chess only supports 2 players max)
  if (Object.keys(players).length >= 2) {
    socket.emit("error", "Game session is full");
    return;
  }

  //assign this user's socket id and the game they selected to the mapping
  //this allows us in future to associate this user with this gameSession they are about to join
  socketIDtoGameSessionID[socket.id] = gameSessionID;

  //get the gamesession object so we can assign a colour to the player
  const selectedGameSession = gameSessions[gameSessionID];

  //determines color for the joining player
  const assignedColour = selectedGameSession.getPlayerColour(players);

  //assign username and colour to the player's socket.id in the gamesession
  players[socket.id] = {
    username: username,
    colour: assignedColour,
  };

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
    //var for readability, this stores username and colour
    const playerDataStoredInsideSession =
      sessionData.connectedPlayersSocketIDs.players[socket.id];

    if (playerDataStoredInsideSession) {
      //get the username of the person disconnecting
      const playerUsername = playerDataStoredInsideSession.username;

      //delete the player from the session
      delete sessionData.connectedPlayersSocketIDs.players[socket.id];

      //check if session is now empty and clean it up to prevent memory leak
      const remainingPlayers = Object.keys(
        sessionData.connectedPlayersSocketIDs.players
      );
      if (remainingPlayers.length === 0) {
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

//get list of available games that have exactly 1 player waiting
//returns array of game objects with session info for frontend display
export function getAvailableGamesForListing(gameSessions) {
  const availableGames = [];

  //iterate through all game sessions
  for (const gameSessionID in gameSessions) {
    const gameSession = gameSessions[gameSessionID];
    const players = gameSession.connectedPlayersSocketIDs.players;
    const playerCount = Object.keys(players).length;

    //only include games with exactly 1 player waiting
    if (playerCount === 1) {
      //get the waiting player's info
      const waitingPlayer = Object.values(players)[0];

      //create game listing object
      //this is the data i can send back to the client, so the client can list stuff about each game currently going
      //so for example the client will see who is in each game and if it is full or not
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
