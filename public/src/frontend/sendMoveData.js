export function sendMoveData(socket, chessPiece, targetSquare) {
  //put the variables into a json object
  //this data is sent to the server so the server can run gamestatemanager.makemove()
  const moveData = {
    chessPiece: chessPiece,
    targetSquare: targetSquare,
  };

  //send a move event to the server, this enables real time communication
  socket.emit("move", moveData);
  console.log("client sent this move data to the sever", moveData);
}
