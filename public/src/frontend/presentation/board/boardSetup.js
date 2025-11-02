import { updateUI } from "./updateUI.js";

/**
 * Set up the initial chess board display
 * Updates the UI to show chess pieces and board state
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Board} chessBoard - The chess board instance with piece positions
 * @param {GameStateManager} gameStateManager - Game state manager for turn tracking
 * @param {string} playerColour - Current player's color for board orientation
 */
export function setupBoard(ctx, chessBoard, gameStateManager, playerColour) {
  updateUI(ctx, chessBoard, gameStateManager, playerColour);
}
