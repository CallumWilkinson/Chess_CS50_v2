export default class ChessPiece {
  /**
   * @param {string} name - 'pawn', 'rook', 'knight', 'bishop', 'queen', or 'king'.
   * @param {string} colour - 'white' or 'black'.
   * @param {Position} position
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
   * @param {Position} newPosition - Square in standard notation (e.g., 'e4')
   */

  //update internal state of the peice to update the posistion associated with the peice
  //so that the grid knows where the peices are, and the peices also know where they are
  //mostly used to keep track of if a pawn as moved at all in the game yet
  updateInternalMoveState(newPosition) {
    this.position = newPosition;
    this.hasMoved = true;
  }
}
