window.onload = () => {
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");
  const tileSize = 80;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? "#eee" : "#777";
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    }
  }
};
