import Pawn from "./pawn.js";
import Rook from "./rook.js";
import Knight from "./knight.js";
import King from "./king.js";
import Queen from "./queen.js";
import Bishop from "./bishop.js";
import Position from "./position.js";
import { FilesAndRanks } from "./constants.js";

export default class Board {
  constructor() {
    //create a grid PROPERTY for the class, grid is a dictionary
    this.grid = {};
  }

  //create position objects for each combination of rank and file
  //set the created position object's name (string) to be the names of each key in the dictionary
  //set all values to null in the dictionary as we are creating an empty board
  createEmptyBoard() {
    FilesAndRanks.RANKS.forEach((rank) => {
      for (let file of FilesAndRanks.FILES) {
        const position = new Position(file + rank);
        //add keys eg a1, b1 ect and set values to null
        this.grid[position.name] = null;
      }
    });
  }
  //create every chess peice required for the game
  //create only the position objects required for the default positions
  //add each peice to its starting postion's in the grid
  //the "game state" is determined by the current position each peice is in in the board's dictionary
  //each position can check if other positions are in it's line of sight and knows the names of its surrounding squares
  //each position has a rank and file property
  //each chess peice keeps track of it's internal state (wheter it has moved or not), and has its own "possible move set"
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

    //temporary array of peices to add to the grid
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

    //this loop is what actually ASSIGNS the chess pieces to grid, in their correct positions
    for (const piece in pieces) {
      //key is a string
      //first iteration of this for loops is whiteRookLeft.position.name
      let key = pieces[piece].position.name;

      //in the first iteration the key is a1 (the whiterookleft's positon name)
      //set the value at the key a1 to the instance of the whiteRookLeft object
      this.grid[key] = pieces[piece];
    }

    //now we create the white and black pawns and add them to the grid
    let whitePawns = [];

    //create 8 white pawns and their starting position objects
    for (let i = 0; i < 8; i++) {
      whitePawns.push(
        new Pawn("white", new Position(String.fromCharCode(97 + i) + "2"))
      );
    }

    //add the whitePawns to grid
    for (const pawn in whitePawns) {
      let key = whitePawns[pawn].position.name;
      this.grid[key] = whitePawns[pawn];
    }

    let blackPawns = [];

    //create 8 black pawns
    for (let i = 0; i < 8; i++) {
      blackPawns.push(
        new Pawn("black", new Position(String.fromCharCode(97 + i) + "7"))
      );
    }

    //add the blackPawns to grid
    for (const pawn in blackPawns) {
      let key = blackPawns[pawn].position.name;
      this.grid[key] = blackPawns[pawn];
    }
  }

  /**
   * @param {string} square - 'a3', 'e4' ect.
   */

  //used to ensure we cant access a key that doesnt actually exist in the dictionary
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

  //check there is no value at a given key, if no value then that square on the board is empty
  squareIsEmpty(square) {
    if (this.grid[square] == null) {
      return true;
    } else {
      return false;
    }
  }
}
