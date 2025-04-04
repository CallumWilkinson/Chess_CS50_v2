import GameStateManager from "./GameStateManager.js";

/**
 * @param {HTMLCanvasElement} canvas - selected piece to be moved
 * @param {GameStateManager} gameStateManager - to run makeMove() function when clicking on a piece
 */

export function setupEventListeners(canvas, gameStateManager) {
  //after clicking on a chess piece, run gamestatemanager.makeMove()
  canvas.addEventListener(`click`, (event) => {});
}
