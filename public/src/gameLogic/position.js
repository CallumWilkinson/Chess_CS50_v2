import { FilesAndRanks } from "../utilities/constants.js";
import { toSquareNotation } from "../utilities/toSquareNotation.js";

/**
 * @param {string} name - name of a position on the chess board 'e5' ect
 */

export default class Position {
  constructor(name) {
    this.name = name;
    this.file = this.name[0];
    this.rank = this.name[1];

    //changes the letter to a number, int type
    this.fileIndex = this.name.charCodeAt(0) - "a".charCodeAt(0);

    //changes the digit in the second position of the string 'name' to a number starting from 0
    // '1' -> 0, '8' -> 7
    this.rankIndex = parseInt(this.name[1], 10) - 1;

    //array of strings - strings are the names of the positions surrounding this position
    this.surroundingpositionNames = this._getSurroundingPositionNames();
  }

  /**
   * @returns {Array[string]} - returns array of strings
   * this function is only run once privately each time a new positon is made, so that its result can be saved to a property for faster access
   */

  _getSurroundingPositionNames() {
    const surroundingSquares = [];

    //variables for readability
    const filePlusOne = String.fromCharCode(this.file.charCodeAt(0) + 1);
    const fileMinusOne = String.fromCharCode(this.file.charCodeAt(0) - 1);
    const rankPlusOne = String.fromCharCode(this.rank.charCodeAt(0) + 1);
    const rankMinusOne = String.fromCharCode(this.rank.charCodeAt(0) - 1);

    //find all surrounding squares as strings
    const right = filePlusOne + this.rank;
    const left = fileMinusOne + this.rank;
    const up = this.file + rankPlusOne;
    const down = this.file + rankMinusOne;
    const diagonalNE = filePlusOne + rankPlusOne;
    const diagonalSE = filePlusOne + rankMinusOne;
    const diagonalSW = fileMinusOne + rankMinusOne;
    const diagonalNW = fileMinusOne + rankPlusOne;

    //add all to array
    surroundingSquares.push(
      right,
      left,
      up,
      down,
      diagonalNE,
      diagonalSE,
      diagonalSW,
      diagonalNW
    );

    //filter out all squares that dont exist
    const validSurroundingSquares = surroundingSquares.filter((position) => {
      return (
        FilesAndRanks.FILES.includes(position[0]) &&
        FilesAndRanks.RANKS.includes(position[1])
      );
    });

    return validSurroundingSquares;
  }

  /**
   * @param {position} targetSquare - 'a3', 'e4' ect.
   * @param {board} board
   * @returns {Bool}
   */

  isTraversable(targetSquare, board) {
    //calculate the difference between startFileIndex and targetFileIndex (abs to remove negative)
    const fileIndexDifferential = targetSquare.fileIndex - this.fileIndex;
    const absFileIndexDifferential = Math.abs(fileIndexDifferential);

    const rankIndexDifferential = targetSquare.rankIndex - this.rankIndex;
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
    const fileDirection = Math.sign(fileIndexDifferential);

    //determine rank direction (positive or negative) positive is up, negative is down
    const rankDirection = Math.sign(rankIndexDifferential);

    //move one square at a time from startSquare towards targetSquare (currentFileIdex and currentRankIndex are INTS)
    //stop when you are blocked by another peice
    let currentFileIndex = this.fileIndex + fileDirection;
    let currentRankIndex = this.rankIndex + rankDirection;

    while (
      currentFileIndex !== targetSquare.fileIndex ||
      currentRankIndex !== targetSquare.rankIndex
    ) {
      //currentSquare is POSITION OBJECT so need to access currentSquare.name to get the string version as key for the dictionary
      const currentSquare = new Position(
        //returns a string (name of position)
        toSquareNotation(currentFileIndex, currentRankIndex)
      );

      //move cursor one square at a time towards target until you land on an occupied square then break (Occupied if theres a value in the dict at currentSquare key)
      if (
        board.grid[currentSquare.name] != null &&
        board.grid[currentSquare.name] != undefined
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
