import Board from "./board.js";
import GameStateManager from "./GameStateManager.js";
import { UIConstants, FilesAndRanks } from "./constants.js";

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Board} chessBoard
 */

export function setupBoard(ctx, chessBoard) {
  //setup empty board, sets the keys of the dictionary to represent the squares of a chess board
  chessBoard.createEmptyBoard();
  //setup pieces in their default positions
  //the position of each peice in the dictionary is the 'under the hood' state of the board
  chessBoard.initialisePieces();

  //update the UI to show chess peices on the screen and set the colors of the squares
  updateUI(ctx, chessBoard);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Board} chessBoard
 */

export function updateUI(ctx, chessBoard) {
  //reset board to blank first
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // then redraw everything

  //set font size for numbers
  ctx.font = `${UIConstants.TILESIZE - 65}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw chessboard based on grid keys
  Object.keys(chessBoard.grid).forEach((square) => {
    //convert dict keys from letters to numbers
    //square is a string
    //convert the string number in "a1" to an int type
    const row = parseInt(square[1], 10) - 1;

    //get unicode value of the letter and subtract the unicode value of a so that numbers in columns increment from 0 upwards
    //the grid object now functions like an array
    const col = square.charCodeAt(0) - "a".charCodeAt(0);

    let x = col * UIConstants.TILESIZE;
    let y = row * UIConstants.TILESIZE;

    // Set alternating colors
    ctx.fillStyle = (row + col) % 2 === 0 ? "#EEEED5" : "#7D945D";

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

  //draw actual peices on the board to reflect the current state of the dictionary
  ctx.font = `${UIConstants.TILESIZE - 15}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const square in chessBoard.grid) {
    //if there is a peice on current square
    if (chessBoard.grid[square] != null) {
      let currentPiece = chessBoard.grid[square];

      //if a white peice
      if (currentPiece.colour === "white") {
        //get the white version of it's unicode
        let whiteUnicodeLogo = currentPiece.whiteUnicodeLogo;

        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]);

        // Flip the rank because canvas (0,0) is top-left, but chess rank 1 is bottom
        const flippedRank = 8 - rank;

        // Compute center of the tile
        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = flippedRank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        //add to current square in loop
        ctx.fillText(whiteUnicodeLogo, x, y);
      }

      //if a black peice
      if (currentPiece.colour === "black") {
        //get the black version of it's unicode
        let blackUnicodeLogo = currentPiece.blackUnicodeLogo;

        const file = square.charCodeAt(0) - 97;
        const rank = parseInt(square[1]);

        // Flip the rank because canvas (0,0) is top-left, but chess rank 1 is bottom
        const flippedRank = 8 - rank;

        // Compute center of the tile
        const x = file * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;
        const y = flippedRank * UIConstants.TILESIZE + UIConstants.TILESIZE / 2;

        //add to current square in loop
        ctx.fillText(blackUnicodeLogo, x, y);
      }
    }
  }
}
