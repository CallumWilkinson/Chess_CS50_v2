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
    //square is a string
    //convert the string number in "a1" to an int type
    const row = parseInt(square[1], 10) - 1;
    //get unicode value of the letter and subtract the unicode value of a so that numbers increment from 0 upwards
    const col = square.charCodeAt(0) - "a".charCodeAt(0);

    // Set alternating colors
    ctx.fillStyle = (row + col) % 2 === 0 ? "#EEEED5" : "#7D945D";

    // Draw tile
    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

    // add text to left side and bottom side of the grid
  });
};
