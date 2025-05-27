import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { getNewGameState } from "./gameLogic/getNewGameState.js";
import GameInstance from "./gameSetup/GameInstance.js";

//setup directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//create express app - a basic web server (express is a framework that handles http requests)
const app = express();

//wrap it with a http server
const httpServer = createServer(app);

//create new Socket.io server, attach it to the http server
//this turns ther web server into a real time webSocket server so clients can talk to eachother
const io = new Server(httpServer);

//set port to 3000 (most common default port), or to the node.js process to upload to render/hosting service
const PORT = process.env.PORT || 3000;

//serve static files from public folder (all the front end stuff)
//basically means when someone goes to port 3000 send them all files in the public folder (the front end)
app.use(express.static(path.join(__dirname, "../public")));

//key is socket.id, values are objects with username and colour
const players = {};

//listen for new socket connections, this runs everytime someone connects to the server
//a socket is a 2 day communication channel between browser and server
io.on("connection", (socket) => {
  //get username from clients auth handsake, if none default to guest
  const username = socket.handshake.auth.username || "Guest";

  //get array of colours currently being used by connected players
  const connectedPlayers = Object.values(players).map((p) => p.colour);

  //create a new game, this function essentially creates the board, gamestatemanager and peices for the backend
  const gameInstance = new GameInstance();
  gameInstance.createNewGame();

  //if black is taken, assign white to new player, otherwise assign black so that black is always player 1
  let assignedColour;

  if (connectedPlayers.includes("black")) {
    assignedColour = "white";
  } else {
    assignedColour = "black";
  }

  //save the player's username and color in the players object using socket.id key
  players[socket.id] = { username, colour: assignedColour };

  //console log in terminal when a user connects
  console.log(`${username} connected as ${assignedColour}`);

  //send a playerinfo message to the newly connected client, tell them their username and color
  //also send the inital board state???
  socket.emit("playerInfo and initial board state", {
    username,
    colour: assignedColour,
    gameInstance,
  });

  //listen for a 'move' event from this client
  socket.on("move", (jsonMoveData) => {
    //console log in terminal move data received
    console.log("Received move:", jsonMoveData);

    //when you receive a move from the opponent, run the make move function
    //return gamestatemanager and board to send to the client
    //this function will run the gamestatemnager.makemove() and return json objects of board and gamestate to send back to client
    const newGameState = getNewGameState(
      jsonMoveData,
      gameInstance.gameStateManager
    );

    //broadcast the move to all other connected clients(not to self)
    socket.broadcast.emit("new game state", newGameState);
  });

  //handle disconnects
  socket.on("disconnect", () => {
    //log disconnection to terminal and delete player username and color
    console.log(`${username} disconnected`);
    delete players[socket.id];
  });
});

//start HTTP server and listen on the specified port
//when i run node backend/server.js this line makes the server go live
httpServer.listen(PORT, () => {
  //log that the server is running and show the local URL
  console.log(`Server running on http://localhost:${PORT}`);
});
