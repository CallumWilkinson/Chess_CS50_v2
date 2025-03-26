import Board from "../src/board";
import Rook from "../src/rook";
import GameStateManager from "../src/gameStateManager";

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
    possibleMovesArray = whiteRook.getPossibleMoves(board, gameStateManager);

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
  });
});
