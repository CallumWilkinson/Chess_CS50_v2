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

    //convert indicies back to chess notation
    const oneSquareForward = this._toSquare(fileIndex, rankPlusOne);

    //add to validMoves array
    validMoves.push(oneSquareForward);

    return validMoves;
  }
}
