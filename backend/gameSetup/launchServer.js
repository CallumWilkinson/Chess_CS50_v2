import { handleMove } from "../helpers/handleMove.js";
import Player from "./player.js";
import SessionManager from "./SessionManager.js";
import SessionLifecycleService from "./services/SessionLifecycleService.js";
import LobbyService from "./services/LobbyService.js";

/**
 * Initialize the Socket.IO server with chess game event handlers.
 * Sets up connection handling, game creation, joining, moves, and disconnections.
 * @param {Object} io - Socket.IO server instance.
 * @returns {Object} Socket ID to game session ID mapping for testing purposes.
 */
export function launchServer(io) {
  const sessionManager = new SessionManager();

  const gameSessions = {};
  const connectedPlayers = {};
  const socketIDtoGameSessionID = {};

  const sessionLifecycle = new SessionLifecycleService({
    sessionManager,
    gameSessions,
    socketIDtoGameSessionID,
    connectedPlayers,
  });

  const lobbyService = new LobbyService({
    sessionLifecycle,
    sessionManager,
  });

  io.on("connection", (socket) => {
    const username = socket.handshake.auth.username || "Guest";

    const newPlayer = new Player(username, socket.id);

    connectedPlayers[socket.id] = newPlayer;
    sessionManager.addPlayer(socket.id, newPlayer);

    socket.emit("connected", {
      username,
      socketId: socket.id,
      message: "Connected to chess server",
    });

    socket.on("getAvailableGames", () => {
      //legacy: supports pre-lobby consumers still calling getAvailableGames
      const availableGames = sessionLifecycle.getAvailableGamesForListing();
      socket.emit("availableGames", availableGames);
    });

    socket.on("createNewChessGame", () => {
      //legacy: transitional path prior to lobby:create
      sessionLifecycle.createNewSession({ socket, username });
    });

    socket.on("joinExistingGame", (gameSessionID) => {
      //legacy: transitional path prior to lobby:join
      const result = sessionLifecycle.joinSession({
        gameSessionID,
        socket,
        username,
      });
      if (!result.ok) {
        socket.emit("error", result.error.message);
      } else {
        let players = [];
        if (Array.isArray(result.players)) {
          players = result.players;
        }

        io.to(gameSessionID).emit("session:players", {
          players,
        });
      }
    });

    socket.on("move", (jsonMoveData) => {
      handleMove(socket, jsonMoveData, sessionManager, io);
    });

    socket.on("lobby:create", (payload, ack) => {
      lobbyService.handleCreate({ io, socket, payload, ack, username });
    });

    socket.on("lobby:list", (_, ack) => {
      lobbyService.handleList({ ack });
    });

    socket.on("lobby:join", (payload, ack) => {
      lobbyService.handleJoin({ io, socket, payload, ack, username });
    });

    socket.on("disconnect", () => {
      sessionLifecycle.handleDisconnect(socket);
    });
  });

  return socketIDtoGameSessionID;
}
//legacy: re-export helpers for tests and backwards-compat consumers
//legacy re-exports removed; tests should import from services instead
