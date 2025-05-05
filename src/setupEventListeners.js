import GameStateManager from "./GameStateManager.js";
import { UIConstants } from "./constants.js";
import Board from "./board.js";
import { toSquareNotation } from "./utils/toSquareNotation.js";
import { updateUI } from "./updateUI.js";
import Position from "./position.js";

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
  let firstClick = null;
  let selectedPiece;
  let possibleMovesArray;
  let canvasRect;

  //clicking on a chesspeice and then on an empty, legal square, will run the gameStateManager.makeMove()
  //this will update board state and switch turns
  //update UI when turn switches
  //add one event listner onto the whole canvas, first click is valid if there is a peice in that square
  canvas.addEventListener(`click`, (event) => {
    //if first click is still null, we treat this as the first click
    if (!firstClick) {
      //store the click event to a variable
      firstClick = event;

      //returns position and size of canvas relative to viewport
      canvasRect = canvas.getBoundingClientRect();

      //get mouse position, minus the top left corner of canvas in pixels
      //x and y now become the actual positions on the canvas where the user clicked
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;

      //get file and rank clicked
      const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
      const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE));

      //find chess peice in that square as string to use as key
      const firstClickedSquareName = toSquareNotation(file, rank);

      //get the chess peice object at given key
      selectedPiece = chessBoard.grid[firstClickedSquareName];

      //if there is a peice in the square you clicked
      if (selectedPiece != null) {
        //getpossiblemoves for selected peice
        possibleMovesArray = selectedPiece.getPossibleMoves(
          chessBoard,
          gameStateManager
        );
      } else {
        //not a valid firstclick as theres no peice in that square to select
        firstClick = null;
        return;
      }
    } else {
      //if first click was valid, then the click after will become the 'second click'
      if (selectedPiece != null) {
        //get mouse position, minus the top left corner of canvas in pixels
        //x and y now become the actual positions on the canvas where the user clicked
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        //get file and rank clicked
        const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
        const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE));

        //find chess peice in that square
        let targetPositionName = toSquareNotation(file, rank);

        //make a position object to pass through make Move function
        let targetPosition = new Position(targetPositionName);

        //update game state
        gameStateManager.makeMove(
          selectedPiece,
          targetPosition,
          possibleMovesArray
        );

        //reset click state
        firstClick = null;

        //update UI to reflect new positions in the grid
        updateUI(ctx, chessBoard, gameStateManager);
      }
    }
  });
}
