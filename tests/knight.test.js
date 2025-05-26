import Board from "../public/src/board";
import Knight from "../public/src/knight";
import Position from "../public/src/position";
import GameStateManager from "../public/src/GameStateManager";
import Pawn from "../public/src/pawn";

describe("knight tests", () => {
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
  });

  test("knight assesess moves from e4", () => {
    const e4 = new Position("e4");
    const whiteKnight = new Knight("white", e4);
    possibleMovesArray = whiteKnight.getPossibleMoves(board);

    const correctMoves = ["d6", "f6", "c5", "g5", "c3", "g3"];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);

    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("Knight can move at start to b3 or d3 from c1", () => {
    const c1 = new Position("c1");
    const whiteKnight = new Knight("white", c1);
    possibleMovesArray = whiteKnight.getPossibleMoves(board);
    expect(possibleMovesArray).toHaveLength(2);
  });

  test("black knight captures a white pawn at g4", () => {
    const gameStateManager = new GameStateManager(board, "black");

    const f6 = new Position("f6");
    const blackKnight = new Knight("black", f6);
    board.grid["f6"] = blackKnight;

    const g4 = new Position("g4");
    const whitePawn = new Pawn("white", g4);
    board.grid["g4"] = whitePawn;

    const blackKnightPossibleMoves = blackKnight.getPossibleMoves(board);
    gameStateManager.makeMove(blackKnight, g4, blackKnightPossibleMoves);

    expect(blackKnight.position.name).toBe("g4");
    expect(board.grid["g4"]).toBe(blackKnight);
    //expecting whitepawn to be in black's captured array
    expect(gameStateManager.capturedPieces["black"][0]).toBe(whitePawn);
  });
});
