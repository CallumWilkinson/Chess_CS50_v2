import ChessPiece from "./ChessPiece.js";
import GameStateManager from "./gameStateManager.js";

export default class Pawn extends ChessPiece {
  constructor(colour, position) {
    super("pawn", colour, position);
  }

  /**
   * Calculates all possible moves for this pawn.
   * @param {Board} board - An instance of Board class.
   * @param {GameStateManager} gameStateManager - an instance of the Game State Manager class to access current turn count
   * @returns {string[]} Array of valid square names (e.g., ['e4', 'f3']).
   */
  getPossibleMoves(board, gameStateManager) {
    //array of strings
    const validMoves = [];

    //white moves up the board, black moves down
    let direction;
    if (this.colour === "white") {
      direction = 1;
    } else {
      direction = -1;
    }

    //convert current position to numbers so we can do math on it (eg e4 = 4,3)
    const { fileIndex, rankIndex } = this.parsePosition(this.position);

    //increment position up 1
    const rankPlusOne = rankIndex + direction;

    //increment position up 2
    const rankPlusTwo = rankIndex + direction * 2;

    //convert indicies back to chess notation
    const oneSquareForward = this._toSquare(fileIndex, rankPlusOne);
    const twoSquaresForward = this._toSquare(fileIndex, rankPlusTwo);

    //if the new square doesnt exist, return error (one forward)
    if (board.squareExistsOnBoard(oneSquareForward) == false) {
      throw new Error(`Invalid move: ${oneSquareForward} is off the board.`);
    }

    //if the new square doesnt exist, return error (two forward)
    if (board.squareExistsOnBoard(twoSquaresForward) == false) {
      throw new Error(`Invalid move: ${twoSquaresForward} is off the board.`);
    }

    //add one forward to validMoves array
    if (board.squareIsEmpty(oneSquareForward)) {
      validMoves.push(oneSquareForward);
    } else {
      throw new Error(
        `Invalid move: ${oneSquareForward} is occupied by another piece.`
      );
    }

    //add two forward to validMoves array if first turn
    if (
      //if empty and white's first turn
      board.squareIsEmpty(twoSquaresForward) &&
      this.colour === "white" &&
      gameStateManager.whiteTurnCount === 0
    ) {
      validMoves.push(twoSquaresForward);
    } else if (
      //else if empty and black's first turn
      board.squareIsEmpty(twoSquaresForward) &&
      this.colour === "black" &&
      gameStateManager.blackTurnCount === 0
    ) {
      validMoves.push(twoSquaresForward);
    } else if (!board.squareIsEmpty(twoSquaresForward)) {
      //throw error if space is occupied
      throw new Error(
        `Invalid move: ${twoSquaresForward} is occupied by another piece.`
      );
    }

    return validMoves;
  }
}
