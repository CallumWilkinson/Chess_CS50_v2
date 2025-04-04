import Board from "./board.js";
import GameStateManager from "./GameStateManager.js";
import { UIConstants } from "./constants.js";

//create the board with peices in their default positions, add labels to the sides and set colours of squares
export function setupBoard(ctx, chessBoard) {
  //get tilesize and board size consants
  const tileSize = UIConstants.TILESIZE;
  const boardSize = UIConstants.boardSize;

  //setup empty board and setup pieces
  chessBoard.createEmptyBoard();
  chessBoard.initialisePieces();

  // Draw chessboard based on grid keys
  Object.keys(chessBoard.grid).forEach((square) => {
    //convert dict keys from letters to numbers
    //square is a string
    //convert the string number in "a1" to an int type
    const row = parseInt(square[1], 10) - 1;

    //get unicode value of the letter and subtract the unicode value of a so that numbers in columns increment from 0 upwards
    //the grid object now functions like an array
    const col = square.charCodeAt(0) - "a".charCodeAt(0);

    let x = col * tileSize;
    let y = row * tileSize;

    // Set alternating colors
    ctx.fillStyle = (row + col) % 2 === 0 ? "#EEEED5" : "#7D945D";

    // Draw tile
    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

    // add text to left side of the grid
    if (col === 0) {
      ctx.fillStyle = "black";
      ctx.fillText(chessBoard.ranks[row], x + 5, y + tileSize * 0.7);
    }

    //add text to bottom of grid
    if (row === 7) {
      ctx.fillStyle = "black";
      ctx.fillText(
        chessBoard.files[col],
        x + tileSize * 0.75,
        y + tileSize - 5
      );
    }
  });

  //draw peices on the board using unicode values
  drawPieces(ctx, chessBoard);
}

export function drawPieces(ctx, board) {
  ctx.font = `${UIConstants.TILESIZE - 15}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const square in board.grid) {
    //if there is a peice on current square
    if (board.grid[square] != null) {
      let currentPiece = board.grid[square];

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
