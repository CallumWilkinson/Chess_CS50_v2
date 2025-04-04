import Board from "../src/board";
import Queen from "../src/queen";
import GameStateManager from "../src/GameStateManager";

describe("queen tests", () => {
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

  test("white queen moves from e5 to g3", () => {
    let whiteQueen;
    whiteQueen = new Queen(currentPlayerColour, "e5");
    possibleMovesArray = whiteQueen.getPossibleMoves(board);
    gameStateManager.makeMove(whiteQueen, "g3", possibleMovesArray);

    let correctMoves = [
      "e6", // vertical up
      "e4",
      "e3", // vertical down
      "d5",
      "c5",
      "b5",
      "a5", // horizontal left
      "f5",
      "g5",
      "h5", // horizontal right
      "d6", // diagonal up-left
      "f6", // diagonal up-right
      "d4",
      "c3", // diagonal down-left
      "f4",
      "g3", // diagonal down-right
    ];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(whiteQueen.position).toBe("g3");
    expect(whiteQueen.hasMoved).toBe(true);
    expect(board.grid["e5"]).toBe(null);
    expect(board.grid["g3"]).toBe(whiteQueen);
  });
});
