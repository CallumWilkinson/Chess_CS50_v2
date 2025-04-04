import GameStateManager from "../src/GameStateManager";
import Board from "../src/board";

describe("Game State Manager class tests", () => {
  let board;
  let gameStateManager;
  beforeEach(() => {
    board = new Board();
    gameStateManager = new GameStateManager(board, "white");
  });

  test("change from turn 1 to turn 2", () => {
    gameStateManager.switchTurn();
    expect(gameStateManager.whiteTurnCount).toEqual(1);
    expect(gameStateManager.blackTurnCount).toEqual(0);
  });
});
