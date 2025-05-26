import Board from "../public/src/gameLogic//board";
import Queen from "../public/src/chessPieces/queen";
import GameStateManager from "../public/src/gameLogic/GameStateManager";
import Position from "../public/src/gameLogic/position";
import Pawn from "../public/src/chessPieces/pawn";

describe("queen tests", () => {
  let gameStateManager;
  const currentPlayerColour = "white";
  let possibleMovesArray;
  let board;
  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    board.initialisePieces();
    gameStateManager = new GameStateManager(board, currentPlayerColour);
  });

  test("white queen moves from e5 to g3", () => {
    const e5 = new Position("e5");
    const g3 = new Position("g3");
    const whiteQueen = new Queen(currentPlayerColour, e5);
    possibleMovesArray = whiteQueen.getPossibleMoves(board);
    gameStateManager.makeMove(whiteQueen, g3, possibleMovesArray);

    const correctMoves = [
      "e6", // vertical up
      "e4",
      "e3", // vertical down
      "d5",
      "c5",
      "b5",
      "a5", // horizontal left
      "f5",
      "g5",
      "h5", // horizontal right
      "d6", // diagonal up-left
      "f6", // diagonal up-right
      "d4",
      "c3", // diagonal down-left
      "f4",
      "g3", // diagonal down-right
      "c7", //capture black pawn
      "e7", //capture black pawn
      "g7", //capture black pawn
    ];
    expect(possibleMovesArray).toHaveLength(correctMoves.length);
    correctMoves.forEach((move) => {
      expect(possibleMovesArray).toContain(move);
    });
    expect(whiteQueen.position.name).toBe("g3");
    expect(whiteQueen.hasMoved).toBe(true);
    expect(board.grid["e5"]).toBe(null);
    expect(board.grid["g3"]).toBe(whiteQueen);
  });

  test("black queen captures a white pawn", () => {
    //make it whites turn just for this test
    gameStateManager.switchTurn();
    const e5 = new Position("e5");
    const blackQueen = new Queen("black", e5);
    board.grid["e5"] = blackQueen;

    const f5 = new Position("f5");
    const whitePawn = new Pawn("white", f5);
    board.grid["f5"] = whitePawn;

    const blackQueenPossibleMoves = blackQueen.getPossibleMoves(board);
    gameStateManager.makeMove(blackQueen, f5, blackQueenPossibleMoves);

    expect(blackQueen.position.name).toBe("f5");
    expect(board.grid["f5"]).toBe(blackQueen);
    //expecting whitepawn to be in black's captured array
    expect(gameStateManager.capturedPieces["black"][0]).toBe(whitePawn);
  });
});
