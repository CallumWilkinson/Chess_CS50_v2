import Board from "../public/src/board.js";
import Position from "../public/src/position.js";
import Rook from "../public/src/rook.js";

describe("tests for position class", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard;
    board.initialisePieces;
  });

  test("create a position object", () => {
    const e5 = new Position("e5");

    expect(e5.name).toBe("e5");
    expect(e5.fileIndex).toBe(4);
    expect(e5.rankIndex).toBe(4);
    expect(e5.file).toBe("e");
    expect(e5.rank).toBe("5");
  });

  test("make a white rook at a1", () => {
    const a1 = new Position("a1");
    const whiteRookLeft = new Rook("white", a1);
    expect(whiteRookLeft.position.fileIndex).toBe(0);
    expect(whiteRookLeft.position.rankIndex).toBe(0);
  });

  test("check that position object has correct surrounding squares", () => {
    const e4 = new Position("e4");
    expect(e4.name).toBe("e4");
    expect(e4.surroundingpositionNames[0]).toBe("f4");
  });
});
