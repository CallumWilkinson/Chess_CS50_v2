import GameSession from "../gameSession.js";
import { ChessConstants } from "../../../shared/utilities/gameConstants.js";
import { cleanupOnDisconnect } from "./disconnectCleanup.js";

export const SessionLifecycleErrorCodes = {
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_FULL: "SESSION_FULL",
};

export const SessionLifecycleErrorMessages = {
  [SessionLifecycleErrorCodes.SESSION_NOT_FOUND]: "Game session not found",
  [SessionLifecycleErrorCodes.SESSION_FULL]: "Game session is full",
};

/**
 * Coordinates game session creation, joining, disconnection, and listing logic.
 */
export default class SessionLifecycleService {
  /**
   * @param {Object} config - Dependencies required for session lifecycle operations.
   * @param {SessionManager} config.sessionManager - Manager tracking global session state.
   * @param {Object<string, GameSession>} config.gameSessions - Registry of active sessions indexed by ID.
   * @param {Object<string, string>} config.socketIDtoGameSessionID - Mapping of socket IDs to session IDs.
   * @param {Object<string, Player>} config.connectedPlayers - Registry of connected players by socket ID.
   */
  constructor({
    sessionManager,
    gameSessions,
    socketIDtoGameSessionID,
    connectedPlayers,
  }) {
    this.sessionManager = sessionManager;
    this.gameSessions = gameSessions;
    this.socketIDtoGameSessionID = socketIDtoGameSessionID;
    this.connectedPlayers = connectedPlayers;
  }

  /**
   * Create a new session for the host socket and return creation metadata.
   * @param {Object} params - Parameters for session creation.
   * @param {import("socket.io").Socket} params.socket - Host socket connection.
   * @param {string} params.username - Host username.
   * @param {string|undefined} params.preferredColour - Optional preferred starting colour.
   * @param {string|undefined} params.lobbyName - Optional lobby display name.
   * @returns {Object} Creation payload containing identifiers and assigned colour.
   */
  createSessionForHost({ socket, username, preferredColour, lobbyName }) {
    const newGameSession = new GameSession();

    if (preferredColour) {
      newGameSession.hostPreferredColour = preferredColour;
    }

    if (lobbyName) {
      newGameSession.lobbyName = lobbyName;
    }

    const newGameInstance = newGameSession.createGameInstance();
    newGameInstance.createNewChessGame();

    const assignedColour = newGameSession.getPlayerColour();
    const gameSessionID = newGameSession.gameSessionID;

    this.socketIDtoGameSessionID[socket.id] = gameSessionID;
    this.gameSessions[gameSessionID] = newGameSession;
    this.sessionManager.addSession(gameSessionID, newGameSession);
    this.sessionManager.mapSocketToSession(socket.id, gameSessionID);

    const player = this.sessionManager.getPlayerBySocketId(socket.id);
    if (player) {
      player.setColour(assignedColour);
      newGameSession.addPlayerToSession(player);
    }

    socket.join(gameSessionID);

    const playersSnapshot = buildPlayersSnapshot(newGameSession.connectedUsers);

    socket.emit("playerInfoAndInitialGameState", {
      username,
      colour: assignedColour,
      gameInstance: newGameInstance,
      players: playersSnapshot,
    });

    socket.emit("session:players", { players: playersSnapshot });

    logLifecycle(`${username} connected to gameSessionID ${gameSessionID}`);

    return {
      gameSessionID,
      session: newGameSession,
      gameInstance: newGameInstance,
      assignedColour,
    };
  }

  /**
   * Attempt to join an existing session for the provided socket.
   * @param {Object} params - Parameters for the join attempt.
   * @param {string} params.gameSessionID - Identifier of the session to join.
   * @param {import("socket.io").Socket} params.socket - Joining socket connection.
   * @param {string} params.username - Joining username.
   * @returns {Object} Result object with ok flag and optional error payload.
   */
  joinSession({ gameSessionID, socket, username }) {
    const session = this.gameSessions[gameSessionID];
    if (!session) {
      return {
        ok: false,
        error: {
          code: SessionLifecycleErrorCodes.SESSION_NOT_FOUND,
          message:
            SessionLifecycleErrorMessages[
              SessionLifecycleErrorCodes.SESSION_NOT_FOUND
            ],
        },
      };
    }

    if (session.connectedUsers.length >= ChessConstants.MAX_PLAYERS) {
      return {
        ok: false,
        error: {
          code: SessionLifecycleErrorCodes.SESSION_FULL,
          message:
            SessionLifecycleErrorMessages[
              SessionLifecycleErrorCodes.SESSION_FULL
            ],
        },
      };
    }

    this.socketIDtoGameSessionID[socket.id] = gameSessionID;
    this.sessionManager.mapSocketToSession(socket.id, gameSessionID);

    const assignedColour = session.getPlayerColour();
    const player = this.sessionManager.getPlayerBySocketId(socket.id);
    if (player) {
      player.setColour(assignedColour);
      session.addPlayerToSession(player);
    }

    socket.join(gameSessionID);

    const gameInstance = session.gameInstance;

    const playersSnapshot = buildPlayersSnapshot(session.connectedUsers);

    socket.emit("playerInfoAndInitialGameState", {
      username,
      colour: assignedColour,
      gameInstance,
      players: playersSnapshot,
    });

    logLifecycle(`${username} connected to gameSessionID ${gameSessionID}`);

    return {
      ok: true,
      session,
      gameInstance,
      assignedColour,
      players: playersSnapshot,
    };
  }

  /**
   * Wrapper used by legacy createNewChessGame socket event.
   * @param {Object} params - Invocation parameters.
   * @param {import("socket.io").Socket} params.socket - Host socket connection.
   * @param {string} params.username - Host username.
   */
  createNewSession({ socket, username }) {
    this.createSessionForHost({ socket, username });
  }

  //legacy: joinExistingSession wrapper removed; errors should be emitted by event handlers

  /**
   * Remove a disconnecting player and clean up empty sessions.
   * @param {import("socket.io").Socket} socket - Disconnecting socket.
   */
  handleDisconnect(socket) {
    cleanupOnDisconnect(
      this.gameSessions,
      this.socketIDtoGameSessionID,
      socket,
      this.connectedPlayers
    );
  }

  /**
   * Provide legacy available game listings for the getAvailableGames event.
   * @returns {Array<Object>} Game listing payloads.
   */
  getAvailableGamesForListing() {
    //delegate to sessionManager for single source of truth
    return this.sessionManager.getAvailableGames();
  }

  /**
   * Static helper mirroring the legacy handleDisconnect export.
   * @param {Object<string, GameSession>} gameSessions - Registry of active sessions.
   * @param {Object<string, string>} socketIDtoGameSessionID - Mapping of socket IDs to session IDs.
   * @param {import("socket.io").Socket} socket - Disconnecting socket.
   * @param {Object<string, Player>} connectedPlayers - Registry of connected players.
   */
  static handleDisconnect(
    gameSessions,
    socketIDtoGameSessionID,
    socket,
    connectedPlayers
  ) {
    cleanupOnDisconnect(
      gameSessions,
      socketIDtoGameSessionID,
      socket,
      connectedPlayers
    );
  }

  //listing moved to SessionManager.getAvailableGames
}

export function handleDisconnect(
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  connectedPlayers
) {
  cleanupOnDisconnect(
    gameSessions,
    socketIDtoGameSessionID,
    socket,
    connectedPlayers
  );
}

//prepare sanitized player payload for clients
function buildPlayersSnapshot(connectedUsers) {
  if (!Array.isArray(connectedUsers)) {
    return [];
  }

  return connectedUsers
    .filter((player) => player && typeof player === "object")
    .map((player) => ({
      username:
        typeof player.username === "string" ? player.username : "",
      colour:
        typeof player.colour === "string" ? player.colour : null,
    }));
}

//internal: conditional logging for service messages
function logLifecycle(message) {
  if (process.env.SESSION_LIFECYCLE_LOGS === "1") {
    //eslint-disable-next-line no-console
    console.log(message);
  }
}
