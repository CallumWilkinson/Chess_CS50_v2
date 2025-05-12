import Board from "../src/board";
import Bishop from "../src/bishop";
import GameStateManager from "../src/GameStateManager";
import Position from "../src/position";

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

    const correctMoves = ["d6", "f4", "g3", "f6", "d4", "c3"];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
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
});
