import { updateUI } from "./updateUI.js";

/**
 * Set up the initial chess board display
 * Updates the UI to show chess pieces and board state
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Board} chessBoard - The chess board instance with piece positions
 * @param {GameStateManager} gameStateManager - Game state manager for turn tracking
 */
export function setupBoard(ctx, chessBoard, gameStateManager) {
  updateUI(ctx, chessBoard, gameStateManager);
}
