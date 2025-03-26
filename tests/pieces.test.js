import Board from "../src/board.js";
import Pawn from "../src/pawn.js";
import ChessPiece from "../src/ChessPiece.js";
import GameStateManager from "../src/gameStateManager.js";

describe("Chess Pieces", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
  });

  test("pawn moves from a2 to a3", () => {
    let currentPlayerColour = "white";

    let whitePawn;
    whitePawn = new Pawn(currentPlayerColour, "a2");

    let gameStateManager = new GameStateManager(board, currentPlayerColour);

    let possibleMovesArray;
    possibleMovesArray = whitePawn.getPossibleMoves(board, gameStateManager);

    if (possibleMovesArray.includes("a3")) {
      whitePawn.move("a3");
    }
    expect(whitePawn.position).toBe("a3");
    expect(whitePawn.hasMoved).toBe(true);
  });

  test("white pawn moves from a2 to a4 on its first turn", () => {
    let currentPlayerColour = "white";

    let whitePawn;
    whitePawn = new Pawn(currentPlayerColour, "a2");

    let gameStateManager = new GameStateManager(board, currentPlayerColour);

    let possibleMovesArray;
    possibleMovesArray = whitePawn.getPossibleMoves(board, gameStateManager);
    expect(possibleMovesArray).toContain("a4");
  });

  test("game starts as white, has option to move from a2 to a4 but chooses not to move. Then black moves from c7 to c5. White can only move one space next turn", () => {
    let startingPlayerColour = "white";
    let enemyPlayerColour = "black";

    let whitePawn;
    whitePawn = new Pawn(startingPlayerColour, "a2");

    let blackPawn;
    blackPawn = new Pawn(enemyPlayerColour, "c7");

    let gameStateManager = new GameStateManager(board, startingPlayerColour);

    let whitePossibleMovesArray;
    whitePossibleMovesArray = whitePawn.getPossibleMoves(
      board,
      gameStateManager
    );
    expect(whitePossibleMovesArray).toContain("a4");
    expect(whitePossibleMovesArray).toContain("a3");

    gameStateManager.switchTurn();
    expect(gameStateManager.currentPlayerColour).toBe("black");

    let blackPossibleMovesArray;
    blackPossibleMovesArray = blackPawn.getPossibleMoves(
      board,
      gameStateManager
    );
    expect(blackPossibleMovesArray).toContain("c5");

    gameStateManager.switchTurn();
    expect(gameStateManager.currentPlayerColour).toBe("white");

    whitePossibleMovesArray = whitePawn.getPossibleMoves(
      board,
      gameStateManager
    );
    expect(whitePossibleMovesArray).toContain("a3");
    expect(whitePossibleMovesArray).not.toContain("a4");
  });
});
