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
};
