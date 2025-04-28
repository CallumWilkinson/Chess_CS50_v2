import Board from "../src/board";
import Knight from "../src/knight";
import GameStateManager from "../src/GameStateManager";
import Position from "../src/position";

describe("knight tests", () => {
  let gameStateManager;
  let currentPlayerColour = "white";
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("knight assesess moves from e4", () => {
    let e4 = new Position("e4");
    let whiteKnight = new Knight("white", e4);
    possibleMovesArray = whiteKnight.getPossibleMoves(board);

    let correctMoves = ["d6", "f6", "c5", "g5", "c3", "g3"];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);

    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
  });

  test("Knight can move at start to b3 or d3 from c1", () => {
    let c1 = new Position("c1");
    let whiteKnight = new Knight("white", c1);
    possibleMovesArray = whiteKnight.getPossibleMoves(board);
    expect(possibleMovesArray).toHaveLength(2);
  });
});
