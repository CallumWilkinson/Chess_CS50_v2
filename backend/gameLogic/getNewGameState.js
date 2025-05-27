import Position from "./position.js";

export function getNewGameState(jsonMoveData, currentGameStateManager) {
  //deconstruct the json data object
  const { possibleMovesArray, chessPiece, targetSquareName } = jsonMoveData;

  //make position object so i can run makemove
  //note for later i could probably just remove this and pass jsut the name through to makemove but that would mean refactoring all my tests too
  const targetSquare = new Position(targetSquareName);

  //run the move on server side
  const moveSuccessful = currentGameStateManager.makeMove(
    chessPiece,
    targetSquare,
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
