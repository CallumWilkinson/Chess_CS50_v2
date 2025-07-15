/**
 * @param {import("socket.io").Socket} socket
 */

export default function joinExistingGameOrCreateNewChessGame(socket) {
  //if no socket then exit
  if (!socket) {
    return;
  }

  //listen for when the socket connects to the server
  socket.on("connect", () => {
    //request the list of available games from the server
    socket.emit("getAvailableGames");
  });

  //when the server responds with available games, decide what to do
  socket.on("availableGames", (availableGames) => {
    //check if the list has a game in it already
    if (availableGames.length > 0) {
      //join the first game in the list
      socket.emit("joinExistingGame", availableGames[0]);
    } else {
      //else create a new game
      socket.emit("createNewChessGame");
    }
  });
}
