//todo temporary fallback:auto-join/create matchmaking and storage handoff
//remove when welcome.js wires explicit join/list flows from buttons
//legacy:keep until explicit join UI fully replaces it
const PENDING_SESSION_KEY = "pendingGameSession";

/**
 * Attempt to join a pending session stored in browser sessionStorage.
 * This prevents the user from disconnecting upon browser refresh
 * @param {Object} config - Dependencies for the join flow.
 * @param {Object} config.socket - Connected socket.io client.
 * @param {Storage} [config.storage=window.sessionStorage] - Storage provider.
 * @returns {Promise<Object>} Result metadata describing the attempt.
 */
export async function joinPendingSessionFromStorage({
  socket,
  storage = window.sessionStorage,
} = {}) {
  if (!socket || typeof socket.emit !== "function") {
    return { attempted: false };
  }

  if (!storage) {
    return { attempted: false };
  }

  const rawPayload = storage.getItem(PENDING_SESSION_KEY);
  if (!rawPayload) {
    return { attempted: false };
  }

  storage.removeItem(PENDING_SESSION_KEY);

  let parsed;
  try {
    parsed = JSON.parse(rawPayload);
  } catch (error) {
    return { attempted: false };
  }

  if (
    !parsed ||
    typeof parsed.gameSessionID !== "string" ||
    !parsed.gameSessionID
  ) {
    return { attempted: false };
  }

  return await new Promise((resolve) => {
    const payload = { gameSessionID: parsed.gameSessionID };

    socket.emit("lobby:join", payload, (ack) => {
      if (ack && ack.error) {
        resolve({
          attempted: true,
          ok: false,
          error: ack.error,
          gameSessionID: parsed.gameSessionID,
        });
        return;
      }

      resolve({
        attempted: true,
        ok: true,
        gameSessionID: parsed.gameSessionID,
      });
    });
  });
}
