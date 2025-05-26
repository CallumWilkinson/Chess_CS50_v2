import Pawn from "../chessPieces/pawn.js";
import Rook from "../chessPieces/rook.js";
import Knight from "../chessPieces/knight.js";
import King from "../chessPieces/king.js";
import Queen from "../chessPieces/queen.js";
import Bishop from "../chessPieces/bishop.js";
import Position from "./position.js";
import { FilesAndRanks } from "../../shared/utilities/constants";

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
      for (const file of FilesAndRanks.FILES) {
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
    const whiteRookLeft = new Rook("white", new Position("a1"));
    const blackRookLeft = new Rook("black", new Position("a8"));

    const whiteKnightLeft = new Knight("white", new Position("b1"));
    const blackKnightLeft = new Knight("black", new Position("b8"));

    const whiteBishopLeft = new Bishop("white", new Position("c1"));
    const blackBishopLeft = new Bishop("black", new Position("c8"));

    const whiteQueen = new Queen("white", new Position("d1"));
    const blackQueen = new Queen("black", new Position("d8"));

    const whiteKing = new King("white", new Position("e1"));
    const blackKing = new King("black", new Position("e8"));

    const whiteBishopRight = new Bishop("white", new Position("f1"));
    const blackBishopRight = new Bishop("black", new Position("f8"));

    const whiteKnightRight = new Knight("white", new Position("g1"));
    const blackKnightRight = new Knight("black", new Position("g8"));

    const whiteRookRight = new Rook("white", new Position("h1"));
    const blackRookRight = new Rook("black", new Position("h8"));

    //temporary array of peices to add to the grid
    const pieces = [
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
      const key = pieces[piece].position.name;

      //in the first iteration the key is a1 (the whiterookleft's positon name)
      //set the value at the key a1 to the instance of the whiteRookLeft object
      this.grid[key] = pieces[piece];
    }

    //now we create the white and black pawns and add them to the grid
    const whitePawns = [];

    //create 8 white pawns and their starting position objects
    for (let i = 0; i < 8; i++) {
      whitePawns.push(
        new Pawn("white", new Position(String.fromCharCode(97 + i) + "2"))
      );
    }

    //add the whitePawns to grid
    for (const pawn in whitePawns) {
      const key = whitePawns[pawn].position.name;
      this.grid[key] = whitePawns[pawn];
    }

    const blackPawns = [];

    //create 8 black pawns
    for (let i = 0; i < 8; i++) {
      blackPawns.push(
        new Pawn("black", new Position(String.fromCharCode(97 + i) + "7"))
      );
    }

    //add the blackPawns to grid
    for (const pawn in blackPawns) {
      const key = blackPawns[pawn].position.name;
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
