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

//set port to 3000 (most common default port)
const PORT = 3000;

//serve static files from public folder (all the front end stuff)
//basically means when someone goes to port 3000 send them all files in the public folder
app.use(express.static(path.join(__dirname, "../public")));

//serve the /src folder so the browser can load the entry point (main.js)
app.use("/src", express.static(path.join(__dirname, "../src")));

//listen for new socket connections, this runs everytime someone connects to the server
//a socket is a 2 day communication channel between browser and server
io.on("connection", (socket) => {
  //console log when a user connects
  console.log("A user has connected:", socket.id);

  //listen for a 'move' event from this client
  socket.on("move", (data) => {
    //console log move data received
    console.log("Received move:", data);

    //broadcast the move to all other connected clients
    //player B can see player A's move
    socket.broadcast.emit("move", data);
  });

  //hadle disconnects
  socket.on("disconnect", () => {
    //log disconnection
    console.log("User disconnected:", socket.id);
  });
});

//start HTTP server and listen on the specified port
//when i run node backend/server.js this line makes the server go live
httpServer.listen(PORT, () => {
  //log that the server is running and show the local URL
  console.log(`Server running on http://localhost:${PORT}`);
});
