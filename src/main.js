import { setupBoard } from "./boardSetup.js";
import Board from "./board.js";
import GameStateManager from "./GameStateManager.js";
import { setupEventListeners } from "./setupEventListeners.js";

window.onload = () => {
  //get canvas' context
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //create board
  const chessBoard = new Board();

  //create gameStateManager with first player being white
  const gameStateManager = new GameStateManager(chessBoard, "white");

  //create the board with peices in their default positions, add labels to the sides and set colours of squares
  setupBoard(ctx, chessBoard);

  //setup eventlisteners
  setupEventListeners(canvas, gameStateManager);
};
