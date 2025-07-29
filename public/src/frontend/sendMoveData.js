/**
 * Send move data to the server via Socket.IO
 * Packages chess piece and target square into JSON and emits move event
 * @param {Object} socket - Socket.IO client instance
 * @param {Object} chessPiece - The chess piece object to move
 * @param {string} targetSquare - Target square name in chess notation (e.g., "e4")
 */
export function sendMoveData(socket, chessPiece, targetSquare) {
  const moveData = {
    chessPiece: chessPiece,
    targetSquare: targetSquare,
  };

  socket.emit("move", moveData);
  console.log("client sent this move data to the sever", moveData);
}
