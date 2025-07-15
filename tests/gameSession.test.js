import GameSession from "../backend/gameSetup/gameSession.js";
import GameInstance from "../backend/gameSetup/GameInstance.js";
import Board from "../backend/gameLogic/board.js";
import GameStateManager from "../backend/gameLogic/GameStateManager.js";

describe("tests for gameSession class", () => {
  test("constructor generates a gameSession id and a gamesession has a function to create a gameInstance inside of it", () => {
    const newGameSession = new GameSession();

    //checking types for session and sessionID
    expect(newGameSession).toBeInstanceOf(GameSession);
    expect(typeof newGameSession.gameSessionID).toBe("string");
    expect(newGameSession.gameSessionID).toHaveLength(6);

    //create instance inside the session
    const newGameInstance = newGameSession.createGameInstance();

    //checking types for instance and instanceID
    expect(newGameInstance).toBeInstanceOf(GameInstance);
    expect(newGameSession.gameInstance).toBeInstanceOf(GameInstance);
    expect(typeof newGameInstance.gameInstanceID).toBe("string");
    expect(newGameInstance.gameInstanceID).toHaveLength(6);
  });

  test("create a chess game inside a game instance, which is inside a gameSession", () => {
    const newGameSession = new GameSession();
    const newGameInstance = newGameSession.createGameInstance();
    newGameInstance.createNewChessGame();
    const board = newGameInstance.board;
    const gameStateManager = newGameInstance.gameStateManager;

    //asserting that types are correct and exist in the correct structure
    expect(board).toBeInstanceOf(Board);
    expect(gameStateManager).toBeInstanceOf(GameStateManager);
  });

  test("chess game initializes with black as the current player", () => {
    const newGameSession = new GameSession();
    const newGameInstance = newGameSession.createGameInstance();
    newGameInstance.createNewChessGame();
    const gameStateManager = newGameInstance.gameStateManager;

    //verify that the game initializes with black as the current player
    expect(gameStateManager.currentPlayerColour).toBe("black");
    expect(gameStateManager.turnManager.currentPlayerColour).toBe("black");
  });

  test("player color assignment works correctly for two players", () => {
    const newGameSession = new GameSession();
    const players = {};

    //first player gets black
    const firstPlayerColor = newGameSession.getPlayerColour(players);
    expect(firstPlayerColor).toBe("black");

    //simulate first player joining
    players["socket1"] = { username: "player1", colour: "black" };

    //second player gets white
    const secondPlayerColor = newGameSession.getPlayerColour(players);
    expect(secondPlayerColor).toBe("white");
  });
});
