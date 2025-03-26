import Board from "../src/board.js";
import Pawn from "../src/pawn.js";
import ChessPiece from "../src/ChessPiece.js";
import GameStateManager from "../src/gameStateManager.js";

describe("Chess Pieces", () => {
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
  });

  test("pawn moves from a2 to a3", () => {
    let currentPlayerColour = "white";

    let whitePawn;
    whitePawn = new Pawn(currentPlayerColour, "a2");

    let gameStateManager = new GameStateManager(board, currentPlayerColour);

    let possibleMovesArray;
    possibleMovesArray = whitePawn.getPossibleMoves(board, gameStateManager);

    if (possibleMovesArray.includes("a3")) {
      whitePawn.move("a3");
    }
    expect(whitePawn.position).toBe("a3");
    expect(whitePawn.hasMoved).toBe(true);
  });

  test("white pawn moves from a2 to a4 on its first turn", () => {
    let currentPlayerColour = "white";

    let whitePawn;
    whitePawn = new Pawn(currentPlayerColour, "a2");

    let gameStateManager = new GameStateManager(board, currentPlayerColour);

    let possibleMovesArray;
    possibleMovesArray = whitePawn.getPossibleMoves(board, gameStateManager);
    expect(possibleMovesArray).toContain("a4");
  });
});
