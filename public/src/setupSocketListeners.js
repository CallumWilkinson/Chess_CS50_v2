import Position from "./position.js";
import { updateUI } from "./updateUI.js";

/**
 *
 * @param {Board} board
 * @param {GameStateManager} gameStateManager
 * @param {CanvasRenderingContext2D} ctx
 */

export function setupSocketListeners(ctx, board, gameStateManager) {
  //only run if a socket connection exists
  if (typeof window.socket !== "undefined") {
    //when a new player connects, set its colour to window.playerColour global variable
    window.socket.on("playerInfo", (data) => {
      console.log("You are playing as", data.colour);
      window.playerColour = data.colour;
    });

    //when an ENEMY MOVE IS RECEIVED
    window.socket.on("move", (data) => {
      //listens for a "move" event from the server
      //gamestatemanager.makeMove() will send a json object to the server when a player moves
      //extract the square/position names from the data
      const { from, to } = data;

      //simulate the move locally
      //retrive peice that the opponent moved
      const chessPiece = board.grid[from];
      const targetPosition = new Position(to);
      const possibleMoves = chessPiece.getPossibleMoves(board);

      //tell local game state manager to execute move, update board and switch turns
      gameStateManager.makeMove(
        chessPiece,
        targetPosition,
        possibleMoves,
        true
      );

      //update local UI to show the move
      updateUI(ctx, board, gameStateManager);
    });
  }
}
