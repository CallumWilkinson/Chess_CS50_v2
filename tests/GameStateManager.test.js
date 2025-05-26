import GameStateManager from "../backend/gameLogic/GameStateManager.js";
import Board from "../backend/gameLogic/board.js";
import Position from "../backend/gameLogic/position";

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

  test("black pawn captures white pawn, gamestatemanger tracks the capture", () => {
    //scenario setup
    const blackPawn = board.grid["f7"];
    let blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    const f5 = new Position("f5");
    gameStateManager.makeMove(blackPawn, f5, blackPossibleMovesArray);

    const whitePawn = board.grid["g2"];
    const whitePossibleMovesArray = whitePawn.getPossibleMoves(board);
    const g4 = new Position("g4");
    gameStateManager.makeMove(whitePawn, g4, whitePossibleMovesArray);

    //possiblemoves change after each move
    blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    //expect only to be able to move one space forward and to be able to overtake the white pawn
    expect(blackPossibleMovesArray).toEqual(["f4", "g4"]);

    gameStateManager.makeMove(blackPawn, g4, blackPossibleMovesArray);

    //expecting turns to switch after a capture
    expect(gameStateManager.blackTurnCount).toEqual(2);
    expect(gameStateManager.whiteTurnCount).toEqual(1);
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("white");
    //expecting black to have moved to g4
    expect(blackPawn.position.name).toBe("g4");
    expect(board.grid["g4"]).toBe(blackPawn);
    //expecting whitepawn to be in black's captured array
    expect(gameStateManager.capturedPieces["black"][0]).toBe(whitePawn);
  });
});
