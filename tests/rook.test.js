import Board from "../src/board";
import Rook from "../src/rook";
import GameStateManager from "../src/GameStateManager";

describe("Rook tests", () => {
  let board;
  let whiteRook;
  let gameStateManager;
  let currentPlayerColour = "white";
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    whiteRook = new Rook("white", "e5");
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("Rook assesses moves", () => {
    let possibleMovesArray;
    possibleMovesArray = whiteRook.getPossibleMoves(board);

    let correctMoves = [
      "e5",
      "e4",
      "e3",
      "e6",
      "d5",
      "c5",
      "b5",
      "a5",
      "f5",
      "g5",
      "h5",
    ];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });

  test("White rook cant move at start of game (cant jump over other pieces)", () => {
    let whiteRookLeft;
    whiteRookLeft = new Rook("white", "a1");

    let possibleMovesArray;
    possibleMovesArray = whiteRookLeft.getPossibleMoves(board);

    expect(possibleMovesArray).toHaveLength(0);
  });

  test("Black Rook assesses moves from c3", () => {
    let blackRook;
    blackRook = new Rook("black", "c3");

    let possibleMovesArray;
    possibleMovesArray = blackRook.getPossibleMoves(board);

    let correctMoves = [
      "c3",
      "c4",
      "c5",
      "c6",
      "a3",
      "b3",
      "d3",
      "e3",
      "f3",
      "g3",
      "h3",
    ];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });

    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });
});
