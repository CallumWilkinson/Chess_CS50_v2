import Board from "../src/board";
import King from "../src/king";
import GameStateManager from "../src/GameStateManager";

describe("king tests", () => {
  let gameStateManager;
  let currentPlayerColour = "white";
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("king assesess moves from e5", () => {
    let whiteKing = new King("white", "e5");
    possibleMovesArray = whiteKing.getPossibleMoves(board);

    let correctMoves = ["e6", "e4", "f5", "d5", "d6", "d4", "f6", "f4"];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);

    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("king cant move at start", () => {
    let whiteKing = new King("white", "d1");
    possibleMovesArray = whiteKing.getPossibleMoves(board);
    expect(possibleMovesArray).toHaveLength(0);
  });
});
