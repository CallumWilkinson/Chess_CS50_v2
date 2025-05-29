import GameInstance from "./GameInstance.js";
import { handleMove } from "../helpers/handleMove.js";

export function launchServer(io) {
  //holds all game sessions, key is GameID, contains game session objects
  const gameSessions = {};

  //do this when a new user connects to the server
  io.on("connection", (socket) => {
    //get username from clients auth handsake, if none default to guest
    const username = socket.handshake.auth.username || "Guest";

    //when a player connects to the server send them a list of available game ID's so they can choose a lobby to join
    socket.emit("availableGames", Object.keys(gameSessions));

    //when client chooses to create a new game
    socket.on("createNewGame", () => {
      //create a new gameID and gameInstance to add to the gameSessions object
      const gameID = generateGameId();
      const gameInstance = new GameInstance(gameID);

      //create a new game, this function creates the board, the gamestatemanager and all the chess peices
      //the game is now setup like a normal chess board
      gameInstance.createNewGame();

      //key is socket.id, values are objects with username and colour
      //keep track of the players connected to this gameID
      const players = {};
      const assignedColour = getPlayerColour(players);

      //save the player's username and color in the players object using socket.id key
      players[socket.id] = { username, colour: assignedColour };

      //add game data to the gameSessions dictionary
      //i will have 2 players associated with each gameID
      gameSessions[gameID] = {
        id: gameID,
        connectedPlayersSocketIDs: players,
        gameInstance: gameInstance,
      };

      //create a new "room" which is a group of sockets, and connect to it
      //the name of the room becomes the gameID
      //the socket room is essentially the game lobby that the player joins
      //if there is no game with that ID this function makes a new room/lobby automatically
      socket.join(gameID);

      //console log in terminal when a user connects
      console.log(
        `${username} connected to gameID ${gameID} as ${assignedColour}`
      );

      //send a playerinfo message to the newly connected client, tell them their username, their color and the inital board state for them to uptdate their ui
      socket.emit("playerInfo and initial board state", {
        username,
        colour: assignedColour,
        gameInstance,
      });
    });

    //OR when the player selects an existing game to join, run this on the receipt of a "join game" event fom the client
    //join the game, add new player's socketid to the gamesession object and send back the board initial state to the player
    socket.on("joinExistingGame", (gameID) => {
      //add player socket.id to the gameSession dict
      //this creates the key
      const players = gameSessions[gameID].connectedPlayersSocketIDs.players;
      players.push(socket.id);

      //assign color based on joining order
      const assignedColour = getPlayerColour(players);

      //assign username and colour to the player's socket.id in the gamesession dict
      //this adds values to the key
      players[socket.id] = { username, colour: assignedColour };

      //join an exisiting "socket room"
      socket.join(gameID);

      //get the gameInstance that was previously made by the person who made the game previously
      const gameInstance = gameSessions[gameID].gameInstance;

      //send a playerinfo message to the newly connected client, tell them their username, their color and the inital board state for them to uptdate their ui
      socket.emit("playerInfo and initial board state", {
        username,
        colour: assignedColour,
        gameInstance,
      });
    });

    //listen for a 'move' event from this client
    socket.on("move", (jsonMoveData) => {
      handleMove(socket, jsonMoveData, players, gameInstance);
    });

    //handle disconnects
    socket.on("disconnect", () => {
      //log disconnection to terminal and delete player username and color
      console.log(`${username} disconnected`);
      delete players[socket.id];
    });
  });
}

function generateGameId() {
  //generate a 6 character random id (letters and numbers)
  //tostring(36) is base 36 so letters are included
  //slice makes it 6 chars long
  return Math.random().toString(36).slice(2, 8);
}

function getPlayerColour(players) {
  //assign new player a colour
  //get array of colours currently being used by connected players so we can assign black or white to the new player
  const connectedPlayers = Object.values(players).map((p) => p.colour);

  //if black is taken, assign white to new player, otherwise assign black so that black is always player 1
  let assignedColour;

  if (connectedPlayers.includes("black")) {
    assignedColour = "white";
  } else {
    assignedColour = "black";
  }
  return assignedColour;
}
