import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

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
//basically means when someone goes to port 3000 send them all files in the public folder
app.use(express.static(path.join(__dirname, "../public")));

//serve the /src folder so the browser can load the entry point (main.js)
app.use("/src", express.static(path.join(__dirname, "../src")));

//key is socket.id, values are objects with username and colour
const players = {};

//listen for new socket connections, this runs everytime someone connects to the server
//a socket is a 2 day communication channel between browser and server
io.on("connection", (socket) => {
  //get username from clients auth handsake, if none default to guest
  const username = socket.handshake.auth.username || "Guest";

  //get array of colours currently being used by connected players
  const connectedPlayers = Object.values(players).map((p) => p.colour);

  //if white is taken, assign black to new player, otherwise assign white
  let assignedColour;

  if (connectedPlayers.includes("white")) {
    assignedColour = "black";
  } else {
    assignedColour = "white";
  }

  //save the player's username and color in the players object using socket.id key
  players[socket.id] = { username, colour: assignedColour };

  //console log in terminal when a user connects
  console.log(`${username} connected as ${assignedColour}`);

  //send a playerinfo message to the newly connected client, tell them their username and color
  socket.emit("playerInfo", {
    username,
    colour: assignedColour,
  });

  //listen for a 'move' event from this client
  socket.on("move", (data) => {
    //console log in terminal move data received
    console.log("Received move:", data);

    //broadcast the move to all other connected clients(not to self)
    //player B can see player A's move
    socket.broadcast.emit("move", data);
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
