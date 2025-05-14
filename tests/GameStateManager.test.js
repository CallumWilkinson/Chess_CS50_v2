import GameStateManager from "../src/GameStateManager";
import Board from "../src/board";
import Position from "../src/position";
import Pawn from "../src/pawn.js";
import expect from "expect";

describe("Game State Manager class tests", () => {
  let board;
  let gameStateManager;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    //black moves first
    gameStateManager = new GameStateManager(board, "black");
  });

  test("change from turn 1 to turn 2", () => {
    gameStateManager.switchTurn();
    expect(gameStateManager.blackTurnCount).toEqual(1);
    expect(gameStateManager.whiteTurnCount).toEqual(0);
  });

  test("black pawn captures white pawn", () => {
    //scenario setup
    const blackPawn = board.grid["f7"];
    const blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    const f5 = new Position("f5");
    gameStateManager.makeMove(blackPawn, f5, blackPossibleMovesArray);

    const whitePawn = board.grid["g2"];
    const whitePossibleMovesArray = whitePawn.getPossibleMoves(board);
    const g4 = new Position("g4");
    gameStateManager.makeMove(whitePawn, g4, whitePossibleMovesArray);

    //black captures white pawn here
    gameStateManager.capture(selectedPeice, targetPeice);
    expect(gameStateManager.blackTurnCount).toEqual(2);
    expect(gameStateManager.whiteTurnCount).toEqual(1);
    //expecting turns to switch after a capture
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("white");
    expect(blackPawn.Position.name).toBe("g4");
    expect(board.grid["g4"]).toBe(blackPawn);
    expect(whitePawn).toBe(null);
    expect(gameStateManager.capturedPieces["black"[0]]).toBe(whitePawn);
  });
});
