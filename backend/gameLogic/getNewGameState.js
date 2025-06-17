import Position from "./position.js";

export function getNewGameState(jsonMoveData, currentGameStateManager, board) {
  //deconstruct the json data object
  const { chessPiece, targetSquare } = jsonMoveData;

  //get the actual chess peice object thats in the server's board at the correct position
  const selectedPiece = board.grid[chessPiece.position.name];

  const possibleMovesArray = selectedPiece.getPossibleMoves(board);

  //make position object so i can run makemove
  //note for later i could probably just remove this and pass jsut the name through to makemove but that would mean refactoring all my tests too
  const targetSquarePositionObject = new Position(targetSquare.name);

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
