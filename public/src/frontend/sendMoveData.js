export function sendMoveData(chessPiece, targetSquare, possibleMovesArray) {
  //put the variables into a json object
  //this data is sent to the server so the server can run gamestatemanager.makemove()
  const moveData = {
    possibleMovesArray: possibleMovesArray,
    chessPiece: chessPiece,
    targetSquare: targetSquare,
  };

  //send a move event to the server, this enables real time communication
  socket.emit("move", moveData);
}
