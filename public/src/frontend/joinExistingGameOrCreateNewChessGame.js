
//todo temporary fallback:auto-join/create matchmaking and storage handoff
//remove when welcome.js wires explicit join/list flows from buttons
//legacy:keep until explicit join UI fully replaces it
const PENDING_SESSION_KEY = "pendingGameSession";


/**
 * Automatically join an existing game or create a new one
 * Requests available games from server and joins first available, or creates new game
 * Implements simple matchmaking logic for chess games
 * @param {Object} socket - Socket.IO client instance
 */
export default function joinExistingGameOrCreateNewChessGame(socket) {
  if (!socket) {
    return;
  }

  const requestAvailableGames = () => {
    socket.emit("getAvailableGames");
    console.log("Sent request to server to get available games list");
  };

  socket.on("availableGames", (availableGames) => {
    console.log("client received availableGames list");
    if (availableGames.length > 0) {
      socket.emit("joinExistingGame", availableGames[0].gameSessionID);
    } else {
      socket.emit("createNewChessGame");
    }
  });

  if (socket.connected) {
    requestAvailableGames();
  } else {
    socket.once("connect", requestAvailableGames);
  }
}

/**
 * Attempt to join a pending session stored in browser sessionStorage.
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

  if (!parsed || typeof parsed.gameSessionID !== "string" || !parsed.gameSessionID) {
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

