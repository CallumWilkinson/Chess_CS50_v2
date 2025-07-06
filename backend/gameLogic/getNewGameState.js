import Position from "./position.js";

export function getNewGameState(jsonMoveData, currentGameStateManager, board) {
  //deconstruct the json data object
  const { chessPiece, targetSquare } = jsonMoveData;

  //get the actual chess peice object thats in the server's board at the correct position
  const selectedPiece = board.grid[chessPiece.position.name];

  const possibleMovesArray = selectedPiece.getPossibleMoves(board);

  //json data coming from the client sends the target square as a string
  //but the server side tests still use a Position object
  //handle both cases here to keep backwards compatibility
  let targetSquareName;
  if (typeof targetSquare === "string") {
    targetSquareName = targetSquare;
  } else {
    //else if it comes as a position object, then access its string name property
    targetSquareName = targetSquare.name;
  }

  //make position object so i can run makemove
  const targetSquarePositionObject = new Position(targetSquareName);

  //run the move on server side
  const moveSuccessful = currentGameStateManager.makeMove(
    selectedPiece,
    targetSquarePositionObject,
    possibleMovesArray
  );

  if (moveSuccessful) {
    console.log("move successful");

    const newGameState = { currentGameStateManager };

    return newGameState;
  } else {
    console.log("move failed on server side");
  }
}
