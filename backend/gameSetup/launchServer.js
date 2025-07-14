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

    //filter games to only show ones with space for more players (less than 2)
    const availableGames = Object.keys(gameSessions).filter(gameSessionID => {
      //get players object for this game session
      const players = gameSessions[gameSessionID].connectedPlayersSocketIDs.players;
      //only include games that aren't full yet
      return Object.keys(players).length < 2;
    });

    //when a player connects to the server send them a list of available game ID's so they can choose a lobby to join
    socket.emit("availableGames", availableGames);

    //when client chooses to create a new game
    socket.on("createNewChessGame", () => {
      createNewSession(gameSessions, socketIDtoGameSessionID, socket, username);
    });

    //OR
    //when the player selects an existing game to join, run this function on the receipt of a "join game" event fom the client
    //join the game, add new player's socketid to the gamesession object and send back the board initial state to the player
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
      handleDisconnect(gameSessions, socketIDtoGameSessionID, socket);
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

function handleDisconnect(gameSessions, socketIDtoGameSessionID, socket) {
  //find what session the player is in
  const gameSessionID = socketIDtoGameSessionID[socket.id];

  //get session data for the player
  const sessionData = gameSessions[gameSessionID];

  if (sessionData != null) {
    //var for readability, this stores username and colour
    const playerDataStoredInsideSession =
      sessionData.connectedPlayersSocketIDs.players[socket.id];

    //get the username of the person disconnecting
    const playerUsername = playerDataStoredInsideSession.username;

    //delete the key
    delete sessionData.connectedPlayersSocketIDs.players[socket.id];

    //remove stale mapping so reconnects work correctly
    delete socketIDtoGameSessionID[socket.id];

    //log disconnection to terminal and delete player username and color
    console.log(
      `Player ${playerUsername} with socket id of ${socket.id} disconnected from gameSessionID ${gameSessionID}`
    );
  }
}
