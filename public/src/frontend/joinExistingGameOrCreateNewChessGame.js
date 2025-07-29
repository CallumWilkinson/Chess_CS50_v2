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

  socket.on("connect", () => {
    socket.emit("getAvailableGames");
    console.log("Sent request to server to get available games list");
  });

  socket.on("availableGames", (availableGames) => {
    console.log("client received availableGames list");
    if (availableGames.length > 0) {
      socket.emit("joinExistingGame", availableGames[0].gameSessionID);
    } else {
      socket.emit("createNewChessGame");
    }
  });
}
