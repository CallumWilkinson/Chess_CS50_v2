import Board from "../src/board.js";

//create board object and run it's functions to setup the initial board state
window.onload = () => {
  //get canvas
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //set size of tiles and the board
  const tileSize = 80;
  const boardSize = 8;

  //create empty board
  const chessBoard = new Board();
  chessBoard.createEmptyBoard();

  // Draw chessboard based on grid keys
  Object.keys(chessBoard.grid).forEach((square) => {
    //convert dict keys from letters to numbers
    const row = parseInt(square[0], 10) - 1; // Convert "1a" -> row index (0-based)
    const col = square.charCodeAt(1) - "a".charCodeAt(0); // Convert "a" -> 0, "b" -> 1, etc.

    // Set alternating colors
    ctx.fillStyle = (row + col) % 2 === 0 ? "#EEEED5" : "#7D945D";

    // Draw tile
    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

    // add text to left side and bottom side of the grid
  });
};
