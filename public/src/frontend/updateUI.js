import { UIConstants, FilesAndRanks } from "./shared/utilities/constants.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Board} board
 * @param {GameStateManager} gameStateManager
 */

//need to write better comments to explain this function more
//i want to run this function every time a turn ends
export function updateUI(ctx, board, gameStateManager) {
  //reset board to blank first
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // then redraw everything

  //set font size for numbers
  ctx.font = `${UIConstants.TILESIZE - 65}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw chessboard based on grid keys
  Object.keys(board.grid).forEach((square) => {
    //convert dict keys from letters to numbers
    //square is a string
    //convert the string number in "a1" to an int type
    const row = parseInt(square[1], 10) - 1;

    //get unicode value of the letter and subtract the unicode value of a so that numbers in columns increment from 0 upwards
    //the grid object now functions like an array
    const col = square.charCodeAt(0) - "a".charCodeAt(0);

    const x = col * UIConstants.TILESIZE;
    const y = row * UIConstants.TILESIZE;

    if ((row + col) % 2 === 0) {
      // light square
      ctx.fillStyle = "#EEEED5";
    } else {
      // dark square
      ctx.fillStyle = "#7D945D";
    }

    // Draw tile from top left first
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
    //if there is a peice on current square
    if (board.grid[square] != null) {
      const currentPiece = board.grid[square];

      //if a white peice
      if (currentPiece.colour === "white") {
        //get the white version of it's unicode
        const whiteUnicodeLogo = currentPiece.whiteUnicodeLogo;

        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]) - 1;

        // Compute center of the tile
        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        //add to current square in loop
        ctx.fillText(whiteUnicodeLogo, x, y);
      }

      //if a black peice
      if (currentPiece.colour === "black") {
        //get the black version of it's unicode
        const blackUnicodeLogo = currentPiece.blackUnicodeLogo;

        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]) - 1;

        // Compute center of the tile
        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = rank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        //add to current square in loop
        ctx.fillText(blackUnicodeLogo, x, y);
      }
    }
  }

  //update current player turn text
  document.getElementById("current-turn-contents").textContent =
    gameStateManager.currentPlayerColour;
}
