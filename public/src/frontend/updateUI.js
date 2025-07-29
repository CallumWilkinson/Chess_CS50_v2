import { UIConstants, FilesAndRanks } from "./shared/utilities/constants.js";
import { getFileIndex, getRankIndex, isLightSquare } from "./shared/utilities/toSquareNotation.js";

/**
 * Update the visual chess board UI with current game state
 * Redraws the entire board, pieces, coordinates, and turn indicator
 * Called every time a turn ends or game state changes
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context
 * @param {Board} board - Current board state with piece positions
 * @param {GameStateManager} gameStateManager - Game state for turn tracking
 */
export function updateUI(ctx, board, gameStateManager) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.font = `${UIConstants.TILESIZE - 65}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  Object.keys(board.grid).forEach((square) => {
    const row = getRankIndex(square);
    const col = getFileIndex(square);

    const x = col * UIConstants.TILESIZE;
    const y = row * UIConstants.TILESIZE;

    if (isLightSquare(square)) {
      ctx.fillStyle = "#EEEED5";
    } else {
      ctx.fillStyle = "#7D945D";
    }

    ctx.fillRect(
      col * UIConstants.TILESIZE,
      row * UIConstants.TILESIZE,
      UIConstants.TILESIZE,
      UIConstants.TILESIZE
    );

    // add text to left side of the grid
    if (col === 0) {
      ctx.fillStyle = "black";
      ctx.fillText(
        //starting with number 8 on top left
        FilesAndRanks.RANKS[row],
        x + 5,
        y + UIConstants.TILESIZE * 0.7
      );
    }

    //add text to bottom of grid
    if (row === 7) {
      ctx.fillStyle = "black";
      ctx.fillText(
        FilesAndRanks.FILES[col],
        x + UIConstants.TILESIZE * 0.75,
        y + UIConstants.TILESIZE - 5
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

        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        ctx.fillText(whiteUnicodeLogo, x, y);
      }

      if (currentPiece.colour === "black") {
        const blackUnicodeLogo = currentPiece.blackUnicodeLogo;

        const file = getFileIndex(square);
        const rank = getRankIndex(square);

        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        ctx.fillText(blackUnicodeLogo, x, y);
      }
    }
  }

  //update current player turn text
  document.getElementById("current-turn-contents").textContent =
    gameStateManager.currentPlayerColour;
}
