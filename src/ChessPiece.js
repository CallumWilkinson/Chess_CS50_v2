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
   * @param {GameStateManager} gameStateManager - only the pawn's getpossiblemoves needs a gamesatemanager object becuase if its first turn pawn can move 2 squares forward
   * @returns {string[]} An array of valid square names (e.g., ['e5', 'f6']).
   */

  getPossibleMoves(board, gameStateManager) {
    // Derived classes (Pawn, King, etc.) will override this.
    return [];
  }

  /**
   * @param {Position} newPosition - Square in standard notation (e.g., 'e4')
   * @param {Array} possibleMovesArray - ARRAY OF STRINGS (position names) returned from the function getPossibleMoves(), each piece has its own implementation of the function
   */

  //update internal state of the peice to update the posistion associated with the peice
  //so that the grid knows where the peices are, and the peices also know where they are
  move(newPosition, possibleMovesArray) {
    let validMoves = [];
    if (this.hasMoved === false) {
      validMoves = possibleMovesArray;

      if (validMoves.includes(newPosition.name)) {
        this.position = newPosition;
        this.hasMoved = true;
      } else throw new Error("not a valid move");
    } else throw new Error("You have already moved");
  }
}
