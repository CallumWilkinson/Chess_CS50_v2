import { ChessConstants } from "../../../shared/utilities/gameConstants.js";
import SessionLifecycleService, {
  SessionLifecycleErrorCodes,
  SessionLifecycleErrorMessages,
} from "./SessionLifecycleService.js";

export const LobbyEvents = {
  UPDATE: "lobbies:updated",
};

export const LobbyErrorCodes = {
  INVALID_NAME: "INVALID_NAME",
  NAME_TAKEN: "NAME_TAKEN",
  ...SessionLifecycleErrorCodes,
};

export const LobbyErrorMessages = {
  [LobbyErrorCodes.INVALID_NAME]: "Invalid lobby name",
  [LobbyErrorCodes.NAME_TAKEN]: "Lobby name already taken",
  [LobbyErrorCodes.SESSION_NOT_FOUND]:
    SessionLifecycleErrorMessages[SessionLifecycleErrorCodes.SESSION_NOT_FOUND],
  [LobbyErrorCodes.SESSION_FULL]:
    SessionLifecycleErrorMessages[SessionLifecycleErrorCodes.SESSION_FULL],
};

/**
 * Coordinates lobby-specific flows (create/list/join) on top of session lifecycle mechanics.
 */
export default class LobbyService {
  /**
   * @param {Object} config - Dependencies shared with the lobby layer.
   * @param {SessionLifecycleService} config.sessionLifecycle - Session lifecycle coordinator instance.
   * @param {SessionManager} config.sessionManager - Session manager exposing lobby name index helpers.
   */
  constructor({ sessionLifecycle, sessionManager }) {
    this.sessionLifecycle = sessionLifecycle;
    this.sessionManager = sessionManager;
  }

  /**
   * Handle lobby creation requests with validation, acknowledgement, and broadcast updates.
   * @param {Object} params - Invocation parameters supplied by the socket listener.
   * @param {import("socket.io").Server} params.io - Socket.IO server instance for broadcasting updates.
   * @param {import("socket.io").Socket} params.socket - Host socket requesting the lobby.
   * @param {Object} params.payload - Incoming payload containing lobby metadata.
   * @param {Function|undefined} params.ack - Socket acknowledgement callback.
   * @param {string} params.username - Username of the lobby creator.
   */
  handleCreate({ io, socket, payload, ack, username }) {
    const ackFn = ensureAck(ack);
    let rawName = "";
    if (typeof payload?.lobbyName === "string") {
      rawName = payload.lobbyName;
    }
    const displayName = sanitizeLobbyNameForDisplay(rawName);

    if (!displayName) {
      ackFn({ error: createErrorPayload(LobbyErrorCodes.INVALID_NAME) });
      return;
    }

    if (!this.sessionManager.isLobbyNameAvailable(displayName)) {
      const existingSessionId =
        this.sessionManager.findSessionIdByLobbyName(displayName);
      if (existingSessionId) {
        ackFn({ error: createErrorPayload(LobbyErrorCodes.NAME_TAKEN) });
      } else {
        ackFn({ error: createErrorPayload(LobbyErrorCodes.INVALID_NAME) });
      }
      return;
    }

    const preferredColour = parsePreferredColour(payload?.colour);

    const creationResult = this.sessionLifecycle.createSessionForHost({
      socket,
      username,
      preferredColour,
      lobbyName: displayName,
    });

    this.sessionManager.registerLobbyName(
      displayName,
      creationResult.gameSessionID
    );

    ackFn({ gameSessionID: creationResult.gameSessionID });

    this.broadcastLobbyUpdate(io);
  }

  /**
   * Handle lobby listing requests, returning the authoritative snapshot from SessionManager.
   * @param {Object} params - Invocation parameters supplied by the socket listener.
   * @param {Function|undefined} params.ack - Socket acknowledgement callback.
   */
  handleList({ ack }) {
    const ackFn = ensureAck(ack);
    const lobbies = this.sessionManager.getAvailableGames();
    ackFn({ lobbies });
  }

  /**
   * Handle lobby join requests with acknowledgement and broadcast updates.
   * @param {Object} params - Invocation parameters supplied by the socket listener.
   * @param {import("socket.io").Server} params.io - Socket.IO server instance for broadcasting updates.
   * @param {import("socket.io").Socket} params.socket - Joining socket connection.
   * @param {Object} params.payload - Incoming payload containing join data.
   * @param {Function|undefined} params.ack - Socket acknowledgement callback.
   * @param {string} params.username - Username of the joining player.
   */
  handleJoin({ io, socket, payload, ack, username }) {
    const ackFn = ensureAck(ack);
    let sessionId = "";

    if (typeof payload?.gameSessionID === "string") {
      sessionId = payload.gameSessionID;
    } else if (typeof payload?.lobbyName === "string") {
      const searchName = sanitizeLobbyNameForDisplay(payload.lobbyName);
      const foundId = this.sessionManager.findSessionIdByLobbyName(searchName);
      if (foundId) {
        sessionId = foundId;
      }
    }

    if (!sessionId) {
      ackFn({ error: createErrorPayload(LobbyErrorCodes.SESSION_NOT_FOUND) });
      return;
    }

    const result = this.sessionLifecycle.joinSession({
      gameSessionID: sessionId,
      socket,
      username,
    });

    if (!result.ok) {
      ackFn({ error: result.error });
      return;
    }

    ackFn({ ok: true, gameSessionID: sessionId });

    if (
      result.session.lobbyName &&
      result.session.connectedUsers.length >= ChessConstants.MAX_PLAYERS
    ) {
      this.sessionManager.unregisterLobbyName(result.session.lobbyName);
    }

    this.broadcastLobbyUpdate(io);
  }

  /**
   * Broadcast the lobby list snapshot to all clients.
   * @param {import("socket.io").Server} io - Socket.IO server instance.
   */
  broadcastLobbyUpdate(io) {
    io.emit(LobbyEvents.UPDATE, {
      lobbies: this.sessionManager.getAvailableGames(),
    });
  }
}

function ensureAck(ack) {
  if (typeof ack === "function") {
    return ack;
  }
  return () => {};
}

function sanitizeLobbyNameForDisplay(name) {
  if (typeof name !== "string") {
    return "";
  }
  return name.trim().replace(/\s+/g, " ");
}

function parsePreferredColour(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim().toLowerCase();
  if (trimmed === "white" || trimmed === "black") {
    return trimmed;
  }
  return undefined;
}

function createErrorPayload(code) {
  const message = LobbyErrorMessages[code] || "Lobby error";
  return { code, message };
}
