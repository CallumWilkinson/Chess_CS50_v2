import { beforeEach, describe } from "node:test";
import Board from "../src/board.js";
import Position from "../src/position.js";
import Pawn from "../src/pawn.js";
import Rook from "../src/rook.js";

describe("tests for position class", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard;
    board.initialisePieces;
  });

  test("create a position object", () => {
    let e5 = new Position("e5");

    expect(e5.name).toBe("e5");
    expect(e5.fileIndex).toBe(4);
    expect(e5.rankIndex).toBe(4);
    expect(e5.file).toBe("e");
    expect(e5.rank).toBe("5");
  });

  test("make a white rook at a1", () => {
    let a1 = new Position("a1");
    let whiteRookLeft = new Rook("white", a1);
    expect(whiteRookLeft.position.fileIndex).toBe(0);
    expect(whiteRookLeft.position.rankIndex).toBe(1);
  });
});
