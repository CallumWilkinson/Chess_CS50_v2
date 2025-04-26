import ChessPiece from "./ChessPiece.js";
import Pawn from "./pawn.js";
import Rook from "./rook.js";
import Knight from "./knight.js";
import King from "./king.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Position from "./position.js";

//board class represents a chess board
export default class Board {
  constructor() {
    //create a grid PROPERTY for the class
    //grid is a dictionary
    this.grid = {};

    //files and ranks arrays are only used to create labels for the UI
    //MUST REMOVE THIS AND USE THE CONSTANT INSTEAD
    this.files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    this.ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  }

  createEmptyBoard() {
    this.ranks.forEach((rank) => {
      for (let file of this.files) {
        //position
        const position = new Position(file + rank);
        //add keys eg a1, b1 ect and set values to null
        this.grid[position.name] = null;
      }
    });
  }
  //fills dictionary with peices
  initialisePieces() {
    let whiteRookLeft = new Rook("white", new Position("a1"));
    let blackRookLeft = new Rook("black", new Position("a8"));

    let whiteKnightLeft = new Knight("white", new Position("b1"));
    let blackKnightLeft = new Knight("black", new Position("b8"));

    let whiteBishopLeft = new Bishop("white", new Position("c1"));
    let blackBishopLeft = new Bishop("black", new Position("c8"));

    let whiteQueen = new Queen("white", new Position("d1"));
    let blackQueen = new Queen("black", new Position("d8"));

    let whiteKing = new King("white", new Position("e1"));
    let blackKing = new King("black", new Position("e8"));

    let whiteBishopRight = new Bishop("white", new Position("f1"));
    let blackBishopRight = new Bishop("black", new Position("f8"));

    let whiteKnightRight = new Knight("white", new Position("g1"));
    let blackKnightRight = new Knight("black", new Position("g8"));

    let whiteRookRight = new Rook("white", new Position("h1"));
    let blackRookRight = new Rook("black", new Position("h8"));

    let pieces = [
      whiteRookLeft,
      blackRookLeft,
      whiteKnightLeft,
      blackKnightLeft,
      whiteBishopLeft,
      blackBishopLeft,
      whiteKing,
      blackKing,
      whiteQueen,
      blackQueen,
      whiteBishopRight,
      blackBishopRight,
      whiteKnightRight,
      blackKnightRight,
      whiteRookRight,
      blackRookRight,
    ];

    //add pieces to grid
    for (const piece in pieces) {
      this.grid[pieces[piece].position] = pieces[piece];
    }

    let whitePawns = [];

    //create 8 white pawns
    for (let i = 0; i < 8; i++) {
      whitePawns.push(new Pawn("white", String.fromCharCode(97 + i) + "2"));
    }

    //add whitePawns to grid
    for (const pawn in whitePawns) {
      this.grid[whitePawns[pawn].position] = whitePawns[pawn];
    }

    let blackPawns = [];

    //create 8 black pawns
    for (let i = 0; i < 8; i++) {
      blackPawns.push(new Pawn("black", String.fromCharCode(97 + i) + "7"));
    }

    //add blackPawns to grid
    for (const pawn in blackPawns) {
      this.grid[blackPawns[pawn].position] = blackPawns[pawn];
    }
  }

  /**
   * @param {string} square - 'a3', 'e4' ect.
   */

  squareExistsOnBoard(square) {
    if (square in this.grid) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param {string} square - 'a3', 'e4' ect.
   */

  //check there is no value in the selected key
  squareIsEmpty(square) {
    if (this.grid[square] == null) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param {position} startingSquare - 'a3', 'e4' ect.
   * @param {position} targetSquare - 'a3', 'e4' ect.
   * @returns {Bool}
   */

  squareIsInLineOfSight(startingSquare, targetSquare) {
    //calculate the difference between startFileIndex and targetFileIndex (abs to remove negative)

    const fileIndexDifferential =
      targetSquare.fileIndex - startingSquare.fileIndex;
    const absFileIndexDifferential = Math.abs(fileIndexDifferential);

    const rankIndexDifferential =
      targetSquare.rankIndex - startingSquare.rankIndex;
    const absRankIndexDifferential = Math.abs(rankIndexDifferential);

    //check if target is visible in a straight or diagonal line
    //is true when correct
    const isSameFile = absFileIndexDifferential === 0;
    const isSameRank = absRankIndexDifferential === 0;
    const isDiagonal = absFileIndexDifferential === absRankIndexDifferential;

    //not valid line of sight
    if (!isSameFile && !isSameRank && !isDiagonal) {
      return false;
    }

    //determine file direction (positive or negative) positive is right, negative is left
    let fileDirection = Math.sign(fileIndexDifferential);

    //determine rank direction (positive or negative) positive is up, negative is down
    let rankDirection = Math.sign(rankIndexDifferential);

    //move one square at a time from startSquare towards targetSquare (currentFileIdex and currentRankIndex are INTS)
    //stop when you are blocked by another peice
    let currentFileIndex = startingSquare.fileIndex + fileDirection;
    let currentRankIndex = startingSquare.rankIndex + rankDirection;

    while (
      currentFileIndex !== targetSquare.fileIndex ||
      currentRankIndex !== targetSquare.rankIndex
    ) {
      //currentSquare is string ie "e4" to use as key in grid dictionary
      let currentSquare = new Position(
        toString(currentFileIndex, currentRankIndex)
      );

      //move cursor one square at a time towards target until you land on an occupied square then break (Occupied if theres a value in the dict at currentSquare key)
      if (
        this.grid[currentSquare] != null &&
        this.grid[currentSquare] != undefined
      ) {
        //target square is NOT in line of sight
        return false;
      }
      currentFileIndex += fileDirection;
      currentRankIndex += rankDirection;
    }

    // If no occupied spaces found on path, target square IS in line of sight
    return true;
  }
}
