import Board from "../src/board";
import King from "../src/king";
import GameStateManager from "../src/GameStateManager";
import Position from "../src/position";

describe("king tests", () => {
  let gameStateManager;
  let currentPlayerColour = "black";
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("black king assesess moves from e5", () => {
    let e5 = new Position("e5");
    let blackKing = new King("black", e5);
    possibleMovesArray = blackKing.getPossibleMoves(board);

    let correctMoves = ["e6", "e4", "f5", "d5", "d6", "d4", "f6", "f4"];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);

    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("black king cant move at start", () => {
    let blackKing = board.grid["e8"];
    let targetPosition = new Position("d8");
    possibleMovesArray = blackKing.getPossibleMoves(board);

    expect(() => {
      gameStateManager.makeMove(blackKing, targetPosition, possibleMovesArray);
    }).toThrow("Invalid move");

    //expecting the move to fail so black king is still at its start position
    //shouldnt be able to take its own peices
    expect(blackKing.position.name).toBe("e8");
  });
});
