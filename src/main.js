import { setupBoard } from "./boardSetup.js";
import Board from "./board.js";
import GameStateManager from "./GameStateManager.js";
import { setupEventListeners } from "./setupEventListeners.js";
import { setupUIElements } from "./setupUIElements.js";

window.onload = () => {
  //create a html canvas for the chess board to be drawn on, assign its 2d context to a variable
  const canvas = document.getElementById("chessBoard");
  const ctx = canvas.getContext("2d");

  //create a board object and assign it to the browser window
  const chessBoard = new Board();
  window.board = chessBoard;

  //create gameStateManager object with the first player being white
  //assign to browser window
  const gameStateManager = new GameStateManager(chessBoard, "white");
  window.gameStateManager = gameStateManager;

  //setup the chessboard with peices in their default starting positions
  //update the UI to show chess peices on the screen and set the colors of the squares
  //the position of each peice in the dictionary is the 'under the hood' state of the board
  setupBoard(ctx, chessBoard);

  //setup eventlisteners make ui respond to player input
  setupEventListeners(canvas, gameStateManager, chessBoard, ctx);

  //add UI Elements
  setupUIElements();
};
