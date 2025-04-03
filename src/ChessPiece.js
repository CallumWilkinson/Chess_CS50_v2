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
   * @param {Board} board - need to pass a board to run get possible moves function insde move function
   * @param {Array} possibleMovesArray - returned from the function getPossibleMoves(), each piece has its own implementation of the function
   */

  move(newPosition, possibleMovesArray) {
    // Updates the piece's position in internal state
    //Game.makeMove() would remove the piece from the old square in board.grid, place it in the new square, handle captures, etc.
    let validMoves = [];
    if (this.hasMoved === false) {
      validMoves = possibleMovesArray;

      if (validMoves.includes(newPosition)) {
        this.position = newPosition;
        this.hasMoved = true;
      } else throw new Error("not a valid move");
    } else throw new Error("You have already moved");
  }

  /**
   * Helper method to parse 'e4' into numeric indices or row/col
   * so you can do calculations more easily (e.g., e->4, 4->3).
   *
   * @param {string} position - The chess coordinate (e.g. 'e4').
   * @returns {{ fileIndex: number, rankIndex: number }}
   *          Object with numeric indices
   */
  parsePosition(position) {
    //get unicode value of the letter and subtract the unicode value of "a" so that numbers in columns increment from 0 upwards
    const fileIndex = position.charCodeAt(0) - "a".charCodeAt(0); // a=0, b=1, ...

    //convert the string number in "a1" to an int type and -1 to increment from 0
    const rankIndex = parseInt(position[1], 10) - 1; // '1' -> 0, '8' -> 7
    return { fileIndex, rankIndex };
  }

  /**
   * Converts numeric indices back to standard chess notation.
   *
   * @param {number} fileIndex - 0..7
   * @param {number} rankIndex - 0..7
   * @returns {string} Chess notation square (e.g. "e4").
   */
  _toSquare(fileIndex, rankIndex) {
    // Convert 0..7 back to 'a'..'h'
    const fileChar = String.fromCharCode("a".charCodeAt(0) + fileIndex);
    // Convert 0..7 back to '1'..'8'
    const rankChar = (rankIndex + 1).toString();

    return fileChar + rankChar;
  }
}
