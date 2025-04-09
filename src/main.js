import { setupBoard } from "./boardSetup.js";
import Board from "./board.js";
import GameStateManager from "./GameStateManager.js";
import { setupEventListeners } from "./setupEventListeners.js";
import { setupUIElements } from "./setupUIElements.js";

window.onload = () => {
  //get canvas' context
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //create board and assign to window
  const chessBoard = new Board();
  window.board = chessBoard;
  console.log(window.board);

  //create gameStateManager with first player being white
  const gameStateManager = new GameStateManager(chessBoard, "white");
  window.gameStateManager = gameStateManager;

  //create the board with peices in their default positions, add labels to the sides and set colours of squares
  setupBoard(ctx, chessBoard);

  //setup eventlisteners
  setupEventListeners(canvas, gameStateManager, chessBoard, ctx);

  //add UI Elements
  setupUIElements();
};
