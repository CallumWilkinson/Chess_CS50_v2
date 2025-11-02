import getClickedSquareName from "./getClickedSquareName.js";
import { sendMoveData } from "../../adapters/socket/sendMoveData.js";

/**
 * Set up click event listeners for chess piece movement
 * Handles two-click movement: first click selects piece, second click moves it
 * Validates moves against current game state and player permissions
 * @param {Object} socket - Socket.IO client instance for sending moves
 * @param {HTMLCanvasElement} canvas - Chess board canvas element
 * @param {Object} currentGameState - Shared reference to current game state with board and gameStateManager
 */
export function setupMovementEventListeners(
  socket,
  canvas,
  currentGameState
) {
  let firstClick = false;
  let firstClickedSquareName = null;
  let selectedPiece = null;

  canvas.addEventListener(`click`, (event) => {
    if (firstClick == false) {
      firstClick = true;

      firstClickedSquareName = getClickedSquareName(event, canvas, currentGameState.playerColour);
      selectedPiece = currentGameState.board.grid[firstClickedSquareName];

      if (
        selectedPiece == null ||
        selectedPiece.colour !== currentGameState.gameStateManager.currentPlayerColour ||
        selectedPiece.colour !== currentGameState.playerColour
      ) {
        firstClick = false;
        selectedPiece = null;
        return;
      }
    } else {
      //second click is valid if firstClick variable is NOT NULL, so it contains a value
      const secondClickSquareName = getClickedSquareName(event, canvas, currentGameState.playerColour);

      //cancel selection if user double clicks the same square (reset click state)
      if (firstClickedSquareName === secondClickSquareName) {
        firstClick = false;
        selectedPiece = null;
        firstClickedSquareName = null;
        return;
      }

      //check if the second click is on another of the player's own pieces and its their turn
      const newSelectedPiece = currentGameState.board.grid[secondClickSquareName];
      if (
        newSelectedPiece != null &&
        newSelectedPiece.colour === currentGameState.gameStateManager.currentPlayerColour &&
        newSelectedPiece.colour === currentGameState.playerColour
      ) {
        //treat this second click as a new selection
        firstClickedSquareName = secondClickSquareName;
        selectedPiece = newSelectedPiece;
        //firstClick remains true
        return;
      }
      //second click is now considered valid
      const targetPositionName = secondClickSquareName;

      try {
        //send intent to move to the server, the server will make the move if it is valid
        sendMoveData(socket, selectedPiece, targetPositionName);

        //reset click state for the next pair of clicks after a sucessful move
        firstClick = false;
        selectedPiece = null;
        firstClickedSquareName = null;
      } catch (err) {
        // replace with better frontend feedback later
        alert(err.message);
      }
      return;
    }
  });
}
