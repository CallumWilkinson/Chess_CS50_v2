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
    console.log("Sent request to server to get available games list");
  });

  //when the server responds with available games, decide what to do
  socket.on("availableGames", (availableGames) => {
    console.log("client received availableGames list");
    //check if the list has a game in it already
    if (availableGames.length > 0) {
      //join the first game in the list using the gameSessionID
      socket.emit("joinExistingGame", availableGames[0].gameSessionID);
    } else {
      //else create a new game
      socket.emit("createNewChessGame");
    }
  });
}
