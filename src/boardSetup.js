import { updateUI } from "./updateUI.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Board} chessBoard
 * @param {GameStateManager} gameStateManager
 */

export function setupBoard(ctx, chessBoard, gameStateManager) {
  //setup empty board, sets the keys of the dictionary to represent the squares of a chess board
  chessBoard.createEmptyBoard();
  //setup pieces in their default positions
  //the position of each peice in the dictionary is the 'under the hood' state of the board
  chessBoard.initialisePieces();

  //update the UI to show the chess peices on the screen to reflect the current board state
  //set the colors of the squares on the board and draws numbers on left and bottom sides of cavnas
  //update current player colour when turns switch
  updateUI(ctx, chessBoard, gameStateManager);
}
