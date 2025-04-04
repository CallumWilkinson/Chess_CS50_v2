import { setupBoard } from "./boardSetup.js";

window.onload = () => {
  //get canvas' context
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //create the board with peices in their default positions, add labels to the sides and set colours of squares
  setupBoard(ctx);
};
