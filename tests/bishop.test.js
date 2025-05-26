import Board from "../backend/gameLogic/board.js";
import Bishop from "../backend/chessPieces/bishop";
import GameStateManager from "../backend/gameLogic/GameStateManager.js";
import Position from "../backend/gameLogic/position";
import Pawn from "../backend/chessPieces/pawn";

describe("Bishop tests", () => {
  let board;
  let whiteBishop;
  let gameStateManager;
  const currentPlayerColour = "white";
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("white bishop assesses moves from e5", () => {
    const e5 = new Position("e5");
    whiteBishop = new Bishop("white", e5);
    //get possiblemoves returns array of strings (position names not objects)
    const possibleMovesArray = whiteBishop.getPossibleMoves(board);

    const correctMoves = ["d6", "f4", "g3", "f6", "d4", "c3", "g7", "c7"];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("white bishop asseses moves from starting position c1", () => {
    const c1 = new Position("c1");
    whiteBishop = new Bishop("white", c1);
    const possibleMovesArray = whiteBishop.getPossibleMoves(board);

    const correctMoves = [];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });

  test("white bishop moves from f5 to h3, then black bishop moves from d5 to b3", () => {
    //white move
    const f5 = new Position("f5");
    whiteBishop = new Bishop("white", f5);

    const possibleMovesArrayWhite = whiteBishop.getPossibleMoves(board);
    expect(gameStateManager.currentPlayerColour).toBe("white");
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("white");

    const h3 = new Position("h3");
    gameStateManager.makeMove(whiteBishop, h3, possibleMovesArrayWhite);

    expect(board.grid["f5"]).toBe(null);
    expect(board.grid["h3"]).toBe(whiteBishop);

    //blackmove
    const d5 = new Position("d5");
    const blackBishop = new Bishop("black", d5);

    const possibleMovesArrayBlack = blackBishop.getPossibleMoves(board);
    expect(gameStateManager.currentPlayerColour).toBe("black");
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("black");

    const b3 = new Position("b3");
    gameStateManager.makeMove(blackBishop, b3, possibleMovesArrayBlack);

    expect(board.grid["d5"]).toBe(null);
    expect(board.grid["b3"]).toBe(blackBishop);
  });

  test("black bishop captures a white pawn at g3", () => {
    gameStateManager.switchTurn();
    const e5 = new Position("e5");
    const blackBishop = new Bishop("black", e5);
    board.grid["e5"] = blackBishop;

    const g3 = new Position("g3");
    const whitePawn = new Pawn("white", g3);
    board.grid["g3"] = whitePawn;

    const blackBishopPossibleMoves = blackBishop.getPossibleMoves(board);
    gameStateManager.makeMove(blackBishop, g3, blackBishopPossibleMoves);

    expect(blackBishop.position.name).toBe("g3");
    expect(board.grid["g3"]).toBe(blackBishop);
    //expecting whitepawn to be in black's captured array
    expect(gameStateManager.capturedPieces["black"][0]).toBe(whitePawn);
  });
});
