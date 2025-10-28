import GameStateManager from "../../../core/gameLogic/GameStateManager.js";
import Board from "../../../core/gameLogic/board.js";
import Position from "../../../core/gameLogic/position.js";
import { GameStatus } from "../../../shared/utilities/constants.js";
import King from "../../../core/chessPieces/king.js";

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

  test("capturing enemy king ends game with correct winner", () => {
    //create a simple scenario where we can test king capture directly
    const blackPawn = board.grid["f7"];
    const whiteKing = new King("white", new Position("e5"));
    
    //place white king in a position where black pawn can capture it diagonally
    board.grid["e5"] = whiteKing;
    
    //move black pawn to f6 first
    const f6 = new Position("f6");
    let blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    gameStateManager.makeMove(blackPawn, f6, blackPossibleMovesArray);
    
    //switch turn to white - make a dummy move
    const whitePawn = board.grid["a2"];
    const a3 = new Position("a3");
    const whitePossibleMovesArray = whitePawn.getPossibleMoves(board);
    gameStateManager.makeMove(whitePawn, a3, whitePossibleMovesArray);
    
    //now it's black's turn - get actual possible moves for the pawn at f6
    blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    
    //capture the king - pawn at f6 should be able to capture diagonally at e5
    gameStateManager.makeMove(blackPawn, new Position("e5"), blackPossibleMovesArray);
    
    //verify game ends with black as winner
    expect(gameStateManager.gameStatus).toBe(GameStatus.CHECKMATE);
    expect(gameStateManager.winner).toBe("black");
    expect(gameStateManager.capturedPieces["black"]).toContain(whiteKing);
  });

  test("no moves allowed after game ends", () => {
    //manually end the game
    gameStateManager.endGame("white");
    
    const blackPawn = board.grid["f7"];
    const blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    const f5 = new Position("f5");
    
    //attempt to make a move after game is over
    expect(() => {
      gameStateManager.makeMove(blackPawn, f5, blackPossibleMovesArray);
    }).toThrow("Game is over. No more moves allowed.");
  });

  test("endGame method sets correct winner and status", () => {
    expect(gameStateManager.gameStatus).toBe(GameStatus.ONGOING);
    expect(gameStateManager.winner).toBe(null);
    
    gameStateManager.endGame("white");
    
    expect(gameStateManager.gameStatus).toBe(GameStatus.CHECKMATE);
    expect(gameStateManager.winner).toBe("white");
  });
});
