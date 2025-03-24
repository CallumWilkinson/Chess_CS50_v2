import Board from "../src/board.js";
import Pawn from "../src/pawn.js";
import ChessPiece from "../src/ChessPiece.js";

describe("Chess Pieces", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
  });

  test("pawn moves from a2 to a3", () => {
    let whitePawn;
    whitePawn = new Pawn("white", "a2");

    let possibleMovesArray;
    possibleMovesArray = whitePawn.getPossibleMoves(board);
    if (possibleMovesArray.includes("a3")) {
      whitePawn.move("a3");
    }
    expect(whitePawn.position).toBe("a3");
    expect(whitePawn.hasMoved).toBe(true);
  });
});
