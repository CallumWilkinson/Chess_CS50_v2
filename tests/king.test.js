import Board from "../public/src/board";
import King from "../public/src/king";
import GameStateManager from "../public/src/GameStateManager";
import Position from "../public/src/position";
import Pawn from "../public/src/pawn";

describe("king tests", () => {
  let gameStateManager;
  const currentPlayerColour = "black";
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("black king assesess moves from e5", () => {
    const e5 = new Position("e5");
    const blackKing = new King("black", e5);
    possibleMovesArray = blackKing.getPossibleMoves(board);

    const correctMoves = ["e6", "e4", "f5", "d5", "d6", "d4", "f6", "f4"];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);

    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("black king cant move at start", () => {
    const blackKing = board.grid["e8"];
    const targetPosition = new Position("d8");
    possibleMovesArray = blackKing.getPossibleMoves(board);

    expect(() => {
      gameStateManager.makeMove(blackKing, targetPosition, possibleMovesArray);
    }).toThrow("Invalid move");

    //expecting the move to fail so black king is still at its start position
    //shouldnt be able to take its own peices
    expect(blackKing.position.name).toBe("e8");
  });

  test("black king captures a white pawn", () => {
    const e5 = new Position("e5");
    const blackKing = new King("black", e5);
    board.grid["e5"] = blackKing;

    const f5 = new Position("f5");
    const whitePawn = new Pawn("white", f5);
    board.grid["f5"] = whitePawn;

    const blackKingPossibleMoves = blackKing.getPossibleMoves(board);
    gameStateManager.makeMove(blackKing, f5, blackKingPossibleMoves);

    expect(blackKing.position.name).toBe("f5");
    expect(board.grid["f5"]).toBe(blackKing);
    //expecting whitepawn to be in black's captured array
    expect(gameStateManager.capturedPieces["black"][0]).toBe(whitePawn);
  });
});
