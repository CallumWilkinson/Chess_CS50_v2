import GameInstance from "./GameInstance.js";
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

  //create a mapping of socketID to GameSessionID so that i can effiently find which player belongs to which "game session"
  //this will be much more effienct than looping over all game sessions each time someone wants to make a move
  //i guess its like an index in an sql table?
  //once ive made a gameSession class i can remove this
  //can access gameSession.gameSessionID and gameSession.gameInstance.gameInstanceID
  // const socketIDtoGameSessionID = {};

  //WHEN A NEW PLAYER CONNECTS TO THE SERVER DO THIS
  io.on("connection", (socket) => {
    //get username from clients auth handsake, if none default to guest
    const username = socket.handshake.auth.username || "Guest";

    //create a player object for this new connection
    const newPlayer = new Player(username, socket.id);

    //add this player to connectedPlayers object
    connectedPlayers[socket.id] = newPlayer;

    //when a player connects to the server send them a list of available game ID's so they can choose a lobby to join
    socket.emit("availableGames", Object.keys(gameSessions));

    //when the player selects an existing game to join, run this function on the receipt of a "join game" event fom the client
    //join the game, add new player's socketid to the gamesession object and send back the board initial state to the player
    socket.on("joinExistingGame", (gameSessionID) => {
      joinExistingSession(gameSessionID, gameSessions, socket, username);
    });

    //OR when client chooses to create a new game
    socket.on("createNewChessGame", () => {
      createNewSession(gameSessions, socket, username, connectedPlayers);
    });

    //listen for a 'move' event from this client
    //i feel like its wrong to pass the whole server object here jsut so i can called server.to(roomID).emit()?
    socket.on("move", (jsonMoveData) => {
      handleMove(socket, jsonMoveData, gameSessions, io);
    });

    //handle disconnects
    socket.on("disconnect", () => {
      handleDisconnect(gameSessions, socket);
    });
  });
}

function createNewSession(gameSessions, socket, username, connectedPlayers) {
  //create a new gameSession, which as a gameSession ID, knows which players are connected and has a fuction to make a gameInstance
  const newGameSession = new GameSession();

  //create gameInstance
  const newGameInstance = newGameSession.createGameInstance();

  //create a chess game inside the instance, this function creates the board, the gamestatemanager and all the chess peices
  //the game is now setup like a normal chess board
  newGameInstance.createNewChessGame();

  const assignedColour = newGameInstance.player1;

  //get gameSessionID
  const gameSessionID = newGameSession.gameSessionID;

  //add game session object to the gameSessions dictionary, this creates a new entry at the correct key
  gameSessions[gameSessionID] = newGameSession;

  //create a new "room" which is a group of sockets, and connect to it
  //the name of the room becomes the gameSessionID
  //the socket room is essentially the game lobby that the player joins
  //if there is no game with that ID this function makes a new room/lobby automatically
  socket.join(gameSessionID);

  //console log in terminal when a user connects
  console.log(`${username} connected to gameSessionID ${gameSessionID}`);

  //send a playerinfo message to the newly connected client, tell them their username, their color and the inital board state for them to uptdate their ui
  socket.emit("playerInfoAndInitialGameState", {
    username,
    colour: assignedColour,
    gameInstance: newGameInstance,
  });
}

function joinExistingSession(gameSessionID, gameSessions, socket, username) {
  //assign username and colour to the player's socket.id in the gamesession dict
  //this adds values to the key
  gameSessions[gameSessionID].connectedPlayersSocketIDs.players[socket.id] = {
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
}

function handleDisconnect(gameSessions, socket) {
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
      `Player ${playerUsername} with socket id of ${socket.id} disconnected from gameID ${gameSessionID}`
    );
  }
}
