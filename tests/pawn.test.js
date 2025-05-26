import Board from "../public/src/board.js";
import Pawn from "../public/src/pawn.js";
import GameStateManager from "../public/src/GameStateManager.js";
import Position from "../public/src/position.js";

describe("Pawn movement tests", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
  });

  test("pawn moves from a2 to a3", () => {
    const currentPlayerColour = "white";
    const a2 = new Position("a2");
    const a3 = new Position("a3");
    const whitePawn = new Pawn(currentPlayerColour, a2);

    const gameStateManager = new GameStateManager(board, currentPlayerColour);

    const possibleMovesArray = whitePawn.getPossibleMoves(
      board,
      gameStateManager
    );

    gameStateManager.makeMove(whitePawn, a3, possibleMovesArray);

    expect(whitePawn.position.name).toBe("a3");
    expect(whitePawn.hasMoved).toBe(true);
  });

  test("white pawn moves from a2 to a4 on its first turn", () => {
    const currentPlayerColour = "white";

    const a2 = new Position("a2");
    const whitePawn = new Pawn(currentPlayerColour, a2);

    const gameStateManager = new GameStateManager(board, currentPlayerColour);

    const possibleMovesArray = whitePawn.getPossibleMoves(
      board,
      gameStateManager
    );
    expect(possibleMovesArray).toContain("a4");
  });

  test(`game starts as white, has option to move Pawn from a2 to a4 but chooses not to move any peices. Then black moves from c7 to c5. 
    white then moves its pawn two spaces forward`, () => {
    const startingPlayerColour = "white";
    const enemyPlayerColour = "black";

    const a2 = new Position("a2");
    const whitePawn = new Pawn(startingPlayerColour, a2);

    const c7 = new Position("c7");
    const blackPawn = new Pawn(enemyPlayerColour, c7);

    const gameStateManager = new GameStateManager(board, startingPlayerColour);

    let whitePossibleMovesArray = whitePawn.getPossibleMoves(board);
    expect(whitePossibleMovesArray).toContain("a4");
    expect(whitePossibleMovesArray).toContain("a3");

    gameStateManager.switchTurn();
    expect(gameStateManager.currentPlayerColour).toBe("black");

    const blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    expect(blackPossibleMovesArray).toContain("c5");

    gameStateManager.switchTurn();
    expect(gameStateManager.currentPlayerColour).toBe("white");

    whitePossibleMovesArray = whitePawn.getPossibleMoves(board);
    expect(whitePossibleMovesArray).toContain("a3");
    expect(whitePossibleMovesArray).toContain("a4");
  });

  test("white and black pawns move towards eachother", () => {
    const gameStateManager = new GameStateManager(board, "black");
    const e6 = new Position("e6");
    const e5 = new Position("e5");
    const e4 = new Position("e4");
    const e3 = new Position("e3");
    const blackPawn = board.grid["e7"];
    const blackPossibleMovesArray = blackPawn.getPossibleMoves(board);
    const whitePawn = board.grid["e2"];
    const whitePossibleMovesArray = whitePawn.getPossibleMoves(board);

    gameStateManager.makeMove(blackPawn, e6, blackPossibleMovesArray);
    gameStateManager.makeMove(whitePawn, e3, whitePossibleMovesArray);
    gameStateManager.makeMove(blackPawn, e5, blackPossibleMovesArray);
    gameStateManager.makeMove(whitePawn, e4, whitePossibleMovesArray);
    expect(whitePawn.position.name).toBe("e4");
  });
});
