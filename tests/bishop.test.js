import Board from "../src/board";
import Bishop from "../src/bishop";
import GameStateManager from "../src/GameStateManager";
import { TurnManager } from "../src/turnManager";

describe("Bishop tests", () => {
  let board;
  let whiteBishop;
  let gameStateManager;
  let currentPlayerColour = "white";
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("white bishop assesses moves from e5", () => {
    let possibleMovesArray;
    whiteBishop = new Bishop("white", "e5");
    possibleMovesArray = whiteBishop.getPossibleMoves(board);

    let correctMoves = ["d6", "f4", "g3", "f6", "d4", "c3"];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });

  test("white bishop asseses moves from starting position c1", () => {
    let possibleMovesArray;
    whiteBishop = new Bishop("white", "c1");
    possibleMovesArray = whiteBishop.getPossibleMoves(board);

    let correctMoves = [];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });

  test("white bishop moves from f5 to h3, then black bishop moves from d5 to b3", () => {
    //white move
    whiteBishop = new Bishop("white", "f5");
    let possibleMovesArrayWhite = whiteBishop.getPossibleMoves(board);
    expect(gameStateManager.currentPlayerColour).toBe("white");
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("white");
    gameStateManager.makeMove(whiteBishop, "h3", possibleMovesArrayWhite);

    expect(board.grid["f5"]).toBe(null);
    expect(board.grid["h3"]).toBe(whiteBishop);

    //blackmove
    let blackBishop = new Bishop("black", "d5");
    let possibleMovesArrayBlack = blackBishop.getPossibleMoves(board);
    expect(gameStateManager.currentPlayerColour).toBe("black");
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("black");
    gameStateManager.makeMove(blackBishop, "b3", possibleMovesArrayBlack);

    expect(board.grid["d5"]).toBe(null);
    expect(board.grid["b3"]).toBe(blackBishop);
  });
});
