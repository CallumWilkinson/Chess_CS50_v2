import ChessPiece from "./ChessPiece.js";
import { toSquareNotation } from "../../shared/utilities/toSquareNotation.js";

/**
 * Represents a Pawn chess piece
 * Moves forward one square, captures diagonally forward
 * Can move two squares on first move, and has special en passant capture rules
 */
export default class Pawn extends ChessPiece {
  /**
   * Creates a new Pawn piece
   * @param {string} colour - The piece color ('white' or 'black')
   * @param {Position} position - Starting position on the board
   */
  constructor(colour, position) {
    super("pawn", colour, position);

    //unicode symbols for display
    this.whiteUnicodeLogo = "\u2659";
    this.blackUnicodeLogo = "\u265F";
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
    //i think this is a little confusing cos when i render the page, i think i flipped it?
    //from memory i think it was becuase i originally made the dictionary as white first, but then switched it to black first
    //will need to review this
    let direction;
    if (this.colour === "white") {
      direction = 1;
    } else {
      direction = -1;
    }

    //get file and rank index (int type)
    const fileIndex = this.position.fileIndex;
    const rankIndex = this.position.rankIndex;

    //increment position up 1
    const rankIndexPlusOne = rankIndex + direction;

    //increment position up 2
    const rankIndexPlusTwo = rankIndex + direction * 2;

    //convert indicies back to chess notation(string)
    const oneSquareForward = toSquareNotation(fileIndex, rankIndexPlusOne);
    const twoSquaresForward = toSquareNotation(fileIndex, rankIndexPlusTwo);

    //add one forward to validMoves array
    if (
      board.squareExistsOnBoard(oneSquareForward) &&
      board.squareIsEmpty(oneSquareForward)
    ) {
      validMoves.push(oneSquareForward);
    }

    //add two forward to validMoves array if pawn hasnt moved yet AND BOTH squares are empty
    if (
      //if empty and pawn hasnt moved yet, both squares must be empty or the path is blocked
      this.hasMoved === false &&
      board.squareExistsOnBoard(twoSquaresForward) &&
      board.squareExistsOnBoard(oneSquareForward) &&
      board.squareIsEmpty(twoSquaresForward) &&
      board.squareIsEmpty(oneSquareForward)
    ) {
      validMoves.push(twoSquaresForward);
    }

    //set variables for capture moves
    const rankIndexForward = rankIndex + direction;
    const fileIndexPlusOne = fileIndex + 1;
    const fileIndexMinusOne = fileIndex - 1;
    const NWPositionName = toSquareNotation(
      fileIndexMinusOne,
      rankIndexForward
    );
    const NEPositionName = toSquareNotation(fileIndexPlusOne, rankIndexForward);
    const chessPieceAtNWPosition = board.grid[NWPositionName];
    const chessPieceAtNEPosition = board.grid[NEPositionName];

    if (
      //if there is a chess peice NW and its an enemy piece
      board.squareExistsOnBoard(NWPositionName) &&
      chessPieceAtNWPosition != null &&
      chessPieceAtNWPosition.colour != this.colour
    ) {
      //allow a capture
      validMoves.push(NWPositionName);
    }

    if (
      //if there is a peice NE and its and its an enemy peice
      board.squareExistsOnBoard(NEPositionName) &&
      chessPieceAtNEPosition != null &&
      chessPieceAtNEPosition.colour != this.colour
    ) {
      //allow a capture
      validMoves.push(NEPositionName);
    }
    return validMoves;
  }
}
