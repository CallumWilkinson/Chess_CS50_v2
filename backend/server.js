import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { launchServer } from "./gameSetup/launchServer.js";
import { SystemConstants } from "../shared/utilities/gameConstants.js";

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

const PORT = process.env.PORT || SystemConstants.DEFAULT_PORT;
const HOST = "0.0.0.0"; // required in Azure

//serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

//expose shared files for frontend access
app.use("/static/shared", express.static(path.join(__dirname, "../shared")));

//creates new game sessions and adds all socket listeners
launchServer(io);

//start HTTP server and listen on the specified port
//when i run node backend/server.js this line makes the server go live
httpServer.listen(PORT, HOST, () => {
  //log that the server is running and show the local URL
  console.log(`Server running on http://localhost:${PORT}`);
});

// Simple root + health routes to verify HTTP works even before sockets (for azure hosting)
app.get("/", (_req, res) => res.status(200).send("OK: chess server"));
app.get("/health", (_req, res) => res.status(200).send("ok"));
