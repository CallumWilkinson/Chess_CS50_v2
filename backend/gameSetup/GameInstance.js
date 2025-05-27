import Board from "../gameLogic/board.js";
import GameStateManager from "../gameLogic/GameStateManager.js";

export default class GameInstance {
  constructor() {
    //create a board object and assign it to the browser window
    //board contains a dictionary where it's keys are the names of the squares on a chess board
    //the position of each chess peice in the dictionary is the 'under the hood' state of the board
    this.board = new Board();

    //create gameStateManager object with the first player being black
    //gameStateManager tracks the game status (winner/loser)
    //contains makeMove() function which moves peices around in the dictionary to change the state of the board
    //gameStateManager contains a turn manager that tracks who's turn it is
    this.gameStateManager = new GameStateManager(this.board, "black");
  }

  createNewGame() {
    //setup empty board, sets the keys of the dictionary to represent the squares of a chess board
    this.board.createEmptyBoard();
    //setup pieces in their default positions
    //the position of each peice in the dictionary is the 'under the hood' state of the board
    this.board.initialisePieces();
  }
}
