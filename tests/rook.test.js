import Board from "../src/board";
import Rook from "../src/rook";
import Position from "../src/position";

describe("Rook tests", () => {
  let board;
  let whiteRook;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    const e5 = new Position("e5");
    whiteRook = new Rook("white", e5);
  });

  test("Rook assesses moves", () => {
    const possibleMovesArray = whiteRook.getPossibleMoves(board);

    const correctMoves = [
      "e5",
      "e4",
      "e3",
      "e6",
      "d5",
      "c5",
      "b5",
      "a5",
      "f5",
      "g5",
      "h5",
    ];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });

  test("White rook cant move at start of game (cant jump over other pieces)", () => {
    const a1 = new Position("a1");
    const whiteRookLeft = new Rook("white", a1);
    const possibleMovesArray = whiteRookLeft.getPossibleMoves(board);

    expect(possibleMovesArray).toHaveLength(0);
  });

  test("Black Rook assesses moves from c3", () => {
    const c3 = new Position("c3");
    const blackRook = new Rook("black", c3);

    const possibleMovesArray = blackRook.getPossibleMoves(board);

    const correctMoves = [
      "c3",
      "c4",
      "c5",
      "c6",
      "a3",
      "b3",
      "d3",
      "e3",
      "f3",
      "g3",
      "h3",
    ];
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });

    expect(possibleMovesArray).toHaveLength(correctMoves.length);
  });
});
