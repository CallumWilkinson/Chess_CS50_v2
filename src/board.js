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

//board class represents a chess board
class Board {
  constructor() {
    //intialise a grid propery by calling createBoard function
    this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  }
}

module.exports = Board;
