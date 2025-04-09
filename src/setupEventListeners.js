import GameStateManager from "./GameStateManager.js";
import { squareToCanvasCoordinates } from "./utils/coordinates.js";
import { UIConstants } from "./constants.js";
import Board from "./board.js";
import { toSquareNotation } from "./utils/toSquareNotation.js";
import ChessPiece from "./ChessPiece.js";
import { updateUI } from "./boardSetup.js";

/**
 * @param {HTMLCanvasElement} canvas - selected piece to be moved
 * @param {GameStateManager} gameStateManager - to run makeMove() function when clicking on a piece
 * @param {Board} chessBoard
 * @param {CanvasRenderingContext2D} ctx
 */

export function setupEventListeners(canvas, gameStateManager, chessBoard, ctx) {
  let firstClick = null;
  let selectedPiece;
  let possibleMovesArray;
  let targetPosition;
  let canvasRect;

  //after clicking on a chess piece, run gamestatemanager.makeMove()
  //add one event listner onto the whole canvas, then work with mouse coordinates
  canvas.addEventListener(`click`, (event) => {
    if (!firstClick) {
      //first click
      firstClick = event;

      //returns position and size of canvas relative to viewport
      canvasRect = canvas.getBoundingClientRect();

      //get mouse position, minus the bottom left corner of canvas in pixels
      //x and y now become the actual positions on the canvas where the user clicked
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.bottom;

      //get file and rank clicked
      const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
      const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE) + 1);

      //find chess peice in that square
      const firstClickedSquare = toSquareNotation(file, rank);

      //chess peice object
      selectedPiece = chessBoard.grid[firstClickedSquare];

      //getpossiblemoves for selected peice
      possibleMovesArray = selectedPiece.getPossibleMoves(
        chessBoard,
        gameStateManager
      );
    } else {
      //second click

      //get mouse position, minus the bottom left corner of canvas in pixels
      //x and y now become the actual positions on the canvas where the user clicked
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.bottom;

      //get file and rank clicked
      const file = Math.abs(Math.floor(x / UIConstants.TILESIZE));
      const rank = Math.abs(Math.floor(y / UIConstants.TILESIZE) + 1);

      //find chess peice in that square
      targetPosition = toSquareNotation(file, rank);

      gameStateManager.makeMove(
        selectedPiece,
        targetPosition,
        possibleMovesArray
      );

      //reset click state
      firstClick = null;

      //update UI to reflect new positions in the grid
      updateUI(ctx, chessBoard);
      console.log(window.board);
    }
  });
}
