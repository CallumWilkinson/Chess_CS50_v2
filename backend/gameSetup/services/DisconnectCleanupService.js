/**
 * Cleanup logic when a socket disconnects from a session.
 * Removes player from registries, deletes empty sessions, and unmaps socket.
 *
 * @param {Object<string, GameSession>} gameSessions - Active sessions indexed by ID.
 * @param {Object<string, string>} socketIDtoGameSessionID - Map of socket.id -> session ID.
 * @param {import("socket.io").Socket} socket - Disconnecting socket instance.
 * @param {Object<string, Player>} connectedPlayers - Connected players by socket ID.
 */
export function disconnectCleanupService(
  gameSessions,
  socketIDtoGameSessionID,
  socket,
  connectedPlayers
) {
  const gameSessionID = socketIDtoGameSessionID[socket.id];

  delete connectedPlayers[socket.id];

  const sessionData = gameSessions[gameSessionID];
  if (!sessionData) {
    return;
  }

  const disconnectingPlayer = sessionData.connectedUsers.find((player) => {
    return player.socketID === socket.id;
  });

  if (!disconnectingPlayer) {
    return;
  }

  const playerUsername = disconnectingPlayer.username;
  sessionData.removePlayerFromSession(disconnectingPlayer);

  if (sessionData.connectedUsers.length === 0) {
    if (sessionData.lobbyName) {
      logLifecycle(
        `Game session ${gameSessionID} retained for lobby ${sessionData.lobbyName}`
      );
    } else {
      delete gameSessions[gameSessionID];
      logLifecycle(
        `Game session ${gameSessionID} deleted - no players remaining`
      );
    }
  }

  delete socketIDtoGameSessionID[socket.id];

  logLifecycle(
    `Player ${playerUsername} with socket id of ${socket.id} disconnected from gameSessionID ${gameSessionID}`
  );
}

//internal: conditional logging for service messages
function logLifecycle(message) {
  if (process.env.SESSION_LIFECYCLE_LOGS === "1") {
    //eslint-disable-next-line no-console
    console.log(message);
  }
}
