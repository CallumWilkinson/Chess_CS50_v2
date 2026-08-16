import SessionManager from "../../backend/gameSetup/SessionManager.js";
import SessionLifecycleService from "../../backend/gameSetup/services/SessionLifecycleService.js";
import LobbyService from "../../backend/gameSetup/services/LobbyService.js";

import { createTestPlayer } from "./testFactories.js";
import { createMockIOServer, createMockSocket } from "./testUtils.js";

/**
 * Creates the server-side dependencies required for lobby integration tests.
 *
 * Mirrors the setup used by launchServer without starting a real Socket.IO server.
 *
 * @returns {{
 *   sessionManager: SessionManager,
 *   sessionLifecycle: SessionLifecycleService,
 *   lobbyService: LobbyService,
 *   io: Object,
 *   gameSessions: Object,
 *   connectedPlayers: Object,
 *   socketIDtoGameSessionID: Object
 * }}
 */
export function createLobbyTestEnvironment() {
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

  const io = createMockIOServer();

  return {
    sessionManager,
    sessionLifecycle,
    lobbyService,
    io,
    gameSessions,
    connectedPlayers,
    socketIDtoGameSessionID,
  };
}

/**
 * Creates a mock socket and Player, then registers the player as connected.
 *
 * This represents a client that has connected to the server but has not
 * necessarily joined a game session yet.
 *
 * @param {Object} environment
 * @param {string} socketId
 * @param {string} username
 * @returns {{ socket: Object, player: import("../../backend/gameSetup/Player.js").default }}
 */
export function createConnectedTestClient(
  environment,
  socketId,
  username = "testuser",
) {
  const socket = createMockSocket(socketId);
  const player = createTestPlayer(username, socket.id);

  environment.connectedPlayers[socket.id] = player;

  environment.sessionManager.addPlayer(socket.id, player);

  return {
    socket,
    player,
  };
}

/**
 * Creates a lobby through LobbyService and returns the acknowledgement.
 *
 * @param {Object} environment
 * @param {Object} socket
 * @param {string} username
 * @param {string} lobbyName
 * @returns {Object}
 */
export function createTestLobby(
  environment,
  socket,
  username,
  lobbyName = "Test Lobby",
) {
  let response;

  environment.lobbyService.handleCreate({
    io: environment.io,
    socket,
    payload: {
      lobbyName,
    },
    ack: (ackResponse) => {
      response = ackResponse;
    },
    username,
  });

  return response;
}

/**
 * Joins an existing lobby through LobbyService and returns the acknowledgement.
 *
 * @param {Object} environment
 * @param {Object} socket
 * @param {string} username
 * @param {string} gameSessionID
 * @returns {Object}
 */
export function joinTestLobby(environment, socket, username, gameSessionID) {
  let response;

  environment.lobbyService.handleJoin({
    io: environment.io,
    socket,
    payload: {
      gameSessionID,
    },
    ack: (ackResponse) => {
      response = ackResponse;
    },
    username,
  });

  return response;
}
