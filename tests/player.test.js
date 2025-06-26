import GameSession from "../backend/gameSetup/gameSession.js";
import Player from "../backend/gameSetup/player.js";
import GameInstance from "../backend/gameSetup/GameInstance.js";
import Board from "../backend/gameLogic/board.js";
import GameStateManager from "../backend/gameLogic/GameStateManager.js";

describe("Tests for player class", () => {
  beforeEach(() => {
    const newGameSession = new GameSession();
    const newGameInstance = newGameSession.createGameInstance();
    newGameInstance.createNewChessGame();
    const board = newGameInstance.board;
    const gameStateManager = newGameInstance.gameStateManager;
  });

  test("a player object is created with username and socketID properties", () => {
    const player1 = new Player("callum", "socketID123");
    expect(player1.username).toBe("callum");
    expect(player1.socketID).toBe("socketID123");
  });

  test("when a client connects to the server, a new player object should be created", () => {});
});
