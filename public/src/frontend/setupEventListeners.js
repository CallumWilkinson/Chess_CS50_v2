import { updateUI } from "./updateUI.js";
import Position from "../gameLogic/position.js";
import getClickedSquareName from "./getClickedSquareName.js";

/**
 * @param {HTMLCanvasElement} canvas - selected piece to be moved
 * @param {GameStateManager} gameStateManager - to run makeMove() function when clicking on a piece
 * @param {Board} chessBoard
 * @param {CanvasRenderingContext2D} ctx
 */
export function setupMovementEventListeners(
  canvas,
  gameStateManager,
  chessBoard,
  ctx
) {
  //set firstclick to null to start in a neutral state, waiting for the first click
  let firstClick = false;
  let firstClickedSquareName = null;
  let selectedPiece = null;
  let possibleMovesArray = null;

  //clicking on a chesspeice and then on an empty, legal square, will run the gameStateManager.makeMove()
  //this will update board state and switch turns
  //update UI when turn switches
  //add one event listner onto the whole canvas, first click is valid if there is a peice in that square
  canvas.addEventListener(`click`, (event) => {
    //if first click is null, we treat this click event as the first click
    if (firstClick == false) {
      //set to true as this becomes the first click
      firstClick = true;

      //find the name of the clicked square as a string
      firstClickedSquareName = getClickedSquareName(event, canvas);

      //get the chess peice object at given key
      selectedPiece = chessBoard.grid[firstClickedSquareName];

      //only run get possible moves if player selects their colored piece AND its their turn
      if (
        selectedPiece == null ||
        selectedPiece.colour !== gameStateManager.currentPlayerColour ||
        selectedPiece.colour !== window.playerColour
      ) {
        //reset click state as it is an invalid click/invalid selection
        firstClick = false;
        selectedPiece = null;
        return;
      } else {
        //if there is a peice in the square you clicked and its your turn
        //getpossiblemoves for selected peice
        possibleMovesArray = selectedPiece.getPossibleMoves(chessBoard);
      }
    } else {
      //second click is valid if firstClick variable is NOT NULL, so it contains a value
      const secondClickSquareName = getClickedSquareName(event, canvas);

      //cancel selection if user double clicks the same square (reset click state)
      if (firstClickedSquareName === secondClickSquareName) {
        firstClick = false;
        selectedPiece = null;
        possibleMovesArray = null;
        firstClickedSquareName = null;
        return;
      }

      //check if the second click is on another of the player's own pieces
      const newSelectedPiece = chessBoard.grid[secondClickSquareName];
      if (
        newSelectedPiece != null &&
        newSelectedPiece.colour === gameStateManager.currentPlayerColour &&
        newSelectedPiece.colour === window.playerColour
      ) {
        //treat this second click as a new selection
        firstClickedSquareName = secondClickSquareName;
        selectedPiece = newSelectedPiece;
        possibleMovesArray = selectedPiece.getPossibleMoves(chessBoard);
        //firstClick remains true
        return;
      }
      //second click is now considered valid
      //make a position object to pass through make Move function
      const targetPosition = new Position(secondClickSquareName);

      try {
        const moveSuccessful = gameStateManager.makeMove(
          selectedPiece,
          targetPosition,
          possibleMovesArray
        );

        if (moveSuccessful === true) {
          updateUI(ctx, chessBoard, gameStateManager);
          console.log(gameStateManager.capturedPieces);

          //reset click state for the next pair of clicks after a sucessful move
          firstClick = false;
          selectedPiece = null;
          possibleMovesArray = null;
          firstClickedSquareName = null;
        }
      } catch (err) {
        // replace with better frontend feedback later
        alert(err.message);
      }

      return;
    }
  });
}
