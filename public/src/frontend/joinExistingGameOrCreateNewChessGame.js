/**
 * @param @param {import("socket.io").Socket} socket
 */

export default function joinExistingGameOrCreateNewChessGame(socket) {
  //if no socket then exit
  if (!socket) {
    return;
  }

  //the server should send this event as soon as a new client connects
  //so when the front end recieves it, this function is ran
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
