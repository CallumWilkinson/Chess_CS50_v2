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
//basically means when someone goes to port 3000 send them all files in the public folder (the front end)
app.use(express.static(path.join(__dirname, "../public")));

//creates new game sessions and adds all socket listeners
launchServer(io);

//start HTTP server and listen on the specified port
//when i run node backend/server.js this line makes the server go live
httpServer.listen(PORT, () => {
  //log that the server is running and show the local URL
  console.log(`Server running on http://localhost:${PORT}`);
});
