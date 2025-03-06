export default class ChessPiece {
  /**
   * @param {string} name - 'pawn', 'rook', 'knight', 'bishop', 'queen', or 'king'.
   * @param {string} colour - 'white' or 'black'.
   * @param {string} position - Chess square in standard chess notation (e.g., 'e4').
   */

  constructor(name, colour, position) {
    //name would be pawn or king ect AS a STRING
    this.name = name;
    this.colour = colour;
    this.position = position;
    this.hasMoved = false;
  }

  /**
   * Returns an array of possible squares this piece can move to.
   * @param {Board} board - An instance of Board class to check positions of pieces.
   * @returns {string[]} An array of valid square names (e.g., ['e5', 'f6']).
   */

  getPossibleMoves(board) {
    // Derived classes (Pawn, King, etc.) will override this.
    return [];
  }

  /**
   * Moves this piece to a new square. This method just updates
   * internal state; it doesn’t handle captures or board updates.
   *
   * @param {string} newPosition - Square in standard notation (e.g., 'e4').
   */

  move(newPosition) {
    // Updates the piece's position in internal state
    //Game.makeMove() would remove the piece from the old square in board.grid, place it in the new square, handle captures, etc.
    this.position = newPosition;
    this.hasMoved = true;
  }
}
