export default class ChessPiece {
  /**
   * @param {string} name - 'pawn', 'rook', 'knight', 'bishop', 'queen', or 'king'.
   * @param {string} colour - 'white' or 'black'.
   * @param {Position} position
   */

  constructor(name, colour, position) {
    this.name = name;
    this.colour = colour;
    this.position = position;
    this.hasMoved = false;
  }

  /**
   * Returns an array of possible squares this piece can move to.
   * @returns {string[]} An array of valid square names (e.g., ['e5', 'f6']).
   */

  getPossibleMoves() {
    // Derived classes (Pawn, King, etc.) will override this.
    return [];
  }

  /**
   * @param {Position} newPosition - Square in standard notation (e.g., 'e4')
   */

  updateInternalMoveState(newPosition) {
    this.position = newPosition;
    this.hasMoved = true;
  }
}
