// window.onload = () => {
//   const canvas = document.getElementById("chessBoard");
//   const ctx = canvas.getContext("2d");
//   const tileSize = 80;

//   for (let row = 0; row < 8; row++) {
//     for (let col = 0; col < 8; col++) {
//       //fill even numbers with light tile, odd numbers with dark tile
//       ctx.fillStyle = (row + col) % 2 === 0 ? "#eee" : "#777";
//       //draws retangles on canvas
//       ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
//     }
//   }
// };

//import board class
const Board = require("../src/board.js");

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

  //   //draw tiles on canvas
  //   Object.keys(chessBoard.grid).forEach((key) => {
  //     ctx.fillStyle = "grey";
  //     ctx.fillRect(10, 10, 100, 50);
  //   });

  // Draw chessboard based on grid keys
  Object.keys(chessBoard.grid).forEach((square) => {
    //convert keys from letters to numbers
    const row = parseInt(square[0], 10) - 1; // Convert "1a" -> row index (0-based)
    const col = square.charCodeAt(1) - "a".charCodeAt(0); // Convert "a" -> 0, "b" -> 1, etc.

    // Set alternating colors
    ctx.fillStyle = (row + col) % 2 === 0 ? "white" : "grey";

    // Draw tile
    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
  });
};
