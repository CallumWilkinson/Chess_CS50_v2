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
  //board contains a dictionary where it's keys are the names of the squares on a chess board
  //the position of each chess peice in the dictionary is the 'under the hood' state of the board
  const chessBoard = new Board();
  window.board = chessBoard;

  //create gameStateManager object with the first player being white
  //gameStateManager tracks the game status (winner/loser)
  //contains makeMove() function which moves peices around in the dictionary to change the state of the board
  //gameStateManager contains a turn manager that tracks who's turn it is
  //assign to browser window
  const gameStateManager = new GameStateManager(chessBoard, "white");
  window.gameStateManager = gameStateManager;

  //setup the chessboard with peices in their default starting positions
  //update the UI to show chess peices on the screen and set the colors of the squares
  setupBoard(ctx, chessBoard);

  //setup eventlisteners make ui respond to player input
  //clicking on a chesspeice and then on an empty, legal square, will run the gameStateManager.makeMove() function to update board state, switch turns and update UI
  setupEventListeners(canvas, gameStateManager, chessBoard, ctx);

  //add UI Elements
  setupUIElements();
};
