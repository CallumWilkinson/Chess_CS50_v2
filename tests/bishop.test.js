import Board from "../src/board";
import Bishop from "../src/bishop";
import GameStateManager from "../src/gameStateManager";

describe("Bishop tests", () => {
  let board;
  let whiteBishop;
  let gameStateManager;
  let currentPlayerColour = "white";
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    whiteBishop = new Bishop("white", "e5");
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("white bishop assesses moves from e5", () => {
    let possibleMovesArray;
    possibleMovesArray = whiteBishop.getPossibleMoves(board);

    let correctMoves = ["d6", "f4", "g3", "f6", "d4", "c3"];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });
});
