import ChessPiece from "./ChessPiece.js";

export default class Pawn extends ChessPiece {
  constructor(colour, position) {
    super("pawn", colour, position);
  }

  /**
   * Calculates all possible moves for this pawn.
   * @param {Board} board - An instance of Board class.
   * @returns {string[]} Array of valid square names (e.g., ['e4', 'f3']).
   */
  getPossibleMoves(board) {
    const validMoves = [];

    //white moves up the board, black moves down
    let direction;
    if (this.colour === "white") {
      direction = 1;
    } else {
      direction = -1;
    }

    return validMoves;
  }
}
