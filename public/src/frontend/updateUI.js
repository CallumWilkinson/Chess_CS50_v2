import { UIConstants, FilesAndRanks, GameStatus } from "./shared/utilities/constants.js";
import { getFileIndex, getRankIndex, isLightSquare } from "./shared/utilities/toSquareNotation.js";
import { 
  squareToPixelCoordinates, 
  squareToPieceCenterCoordinates, 
  getRankLabelCoordinates, 
  getFileLabelCoordinates 
} from "./shared/utilities/coordinateMapping.js";
import { transformCoordinatesForPlayer } from "./shared/utilities/boardOrientation.js";

/**
 * Update the visual chess board UI with current game state
 * Redraws the entire board, pieces, coordinates, and turn indicator
 * Called every time a turn ends or game state changes
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Board} board - Current board state with piece positions
 * @param {GameStateManager} gameStateManager - Game state for turn tracking
 * @param {string} playerColour - Current player's color for board orientation
 */
export function updateUI(ctx, board, gameStateManager, playerColour) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Add data attributes to canvas for testing
  ctx.canvas.setAttribute("data-game-status", gameStateManager.gameStatus);
  ctx.canvas.setAttribute("data-current-turn", gameStateManager.currentPlayerColour);

  ctx.font = `${UIConstants.TILESIZE - 65}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  Object.keys(board.grid).forEach((square) => {
    const row = getRankIndex(square);
    const col = getFileIndex(square);

    // Transform coordinates based on player perspective
    const { rank: transformedRow, file: transformedCol } = transformCoordinatesForPlayer(row, col, playerColour);
    const { x, y } = squareToPixelCoordinates(transformedCol, transformedRow);

    if (isLightSquare(square)) {
      ctx.fillStyle = "#EEEED5";
    } else {
      ctx.fillStyle = "#7D945D";
    }

    ctx.fillRect(x, y, UIConstants.TILESIZE, UIConstants.TILESIZE);

    // add text to left side of the grid
    if (transformedCol === 0) {
      ctx.fillStyle = "black";
      const rankCoordinates = getRankLabelCoordinates(transformedRow);
      ctx.fillText(
        //starting with number 8 on top left
        FilesAndRanks.RANKS[row],
        rankCoordinates.x,
        rankCoordinates.y
      );
    }

    //add text to bottom of grid
    if (transformedRow === 7) {
      ctx.fillStyle = "black";
      const fileCoordinates = getFileLabelCoordinates(transformedCol);
      ctx.fillText(
        FilesAndRanks.FILES[col],
        fileCoordinates.x,
        fileCoordinates.y
      );
    }
  });

  //DRAW THE ACTUAL PEICES ON THE BOARD TO REFLECT THE CURRENT BOARD STATE
  ctx.font = `${UIConstants.TILESIZE - 15}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const square in board.grid) {
    if (board.grid[square] != null) {
      const currentPiece = board.grid[square];

      if (currentPiece.colour === "white") {
        const whiteUnicodeLogo = currentPiece.whiteUnicodeLogo;

        const file = getFileIndex(square);
        const rank = getRankIndex(square);

        // Transform coordinates based on player perspective
        const { rank: transformedRank, file: transformedFile } = transformCoordinatesForPlayer(rank, file, playerColour);
        const { x, y } = squareToPieceCenterCoordinates(transformedFile, transformedRank);

        ctx.fillText(whiteUnicodeLogo, x, y);
      }

      if (currentPiece.colour === "black") {
        const blackUnicodeLogo = currentPiece.blackUnicodeLogo;

        const file = getFileIndex(square);
        const rank = getRankIndex(square);

        // Transform coordinates based on player perspective
        const { rank: transformedRank, file: transformedFile } = transformCoordinatesForPlayer(rank, file, playerColour);
        const { x, y } = squareToPieceCenterCoordinates(transformedFile, transformedRank);

        ctx.fillText(blackUnicodeLogo, x, y);
      }
    }
  }

  //update current player turn text or display game end result
  if (gameStateManager.gameStatus === GameStatus.CHECKMATE) {
    document.getElementById("current-turn-contents").textContent = 
      `🎉 ${gameStateManager.winner} wins by checkmate!`;
    document.getElementById("current-turn-heading").textContent = "Game Over";
    
    // Add winner display for testing
    const winnerElement = document.getElementById("current-turn-contents");
    winnerElement.setAttribute("data-testid", "winner-display");
    winnerElement.setAttribute("data-winner", gameStateManager.winner);
  } else {
    document.getElementById("current-turn-contents").textContent =
      gameStateManager.currentPlayerColour;
    document.getElementById("current-turn-heading").textContent = "Current Turn";
    
    // Add current turn data for testing
    const turnElement = document.getElementById("current-turn-contents");
    turnElement.setAttribute("data-current-turn", gameStateManager.currentPlayerColour);
  }
}
