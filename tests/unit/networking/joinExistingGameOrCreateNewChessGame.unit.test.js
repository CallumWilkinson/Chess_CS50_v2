import { jest } from "@jest/globals";
import joinExistingGameOrCreateNewChessGame from "../../../public/src/frontend/joinExistingGameOrCreateNewChessGame.js";

describe("joinExistingGameOrCreateNewChessGame", () => {
  let mockSocket;

  beforeEach(() => {
    //create a mock socket object with jest spy functions
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return early if no socket is provided", () => {
    //call function with null socket
    joinExistingGameOrCreateNewChessGame(null);

    //function should exit early and not set up any listeners
    expect(mockSocket.on).not.toHaveBeenCalled();
  });

  test("should set up connect listener that requests available games", () => {
    //call the function with mock socket
    joinExistingGameOrCreateNewChessGame(mockSocket);

    //verify that a connect listener was registered
    expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));

    //get the connect callback function that was registered
    const connectCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === "connect"
    )[1];

    //simulate the connect event by calling the callback
    connectCallback();

    //verify that it emits getAvailableGames request
    expect(mockSocket.emit).toHaveBeenCalledWith("getAvailableGames");
  });

  test("should set up availableGames listener", () => {
    //call the function with mock socket
    joinExistingGameOrCreateNewChessGame(mockSocket);

    //verify that an availableGames listener was registered
    expect(mockSocket.on).toHaveBeenCalledWith(
      "availableGames",
      expect.any(Function)
    );
  });

  test("should join existing game when games are available", () => {
    //call the function with mock socket
    joinExistingGameOrCreateNewChessGame(mockSocket);

    //get the availableGames callback function that was registered
    const availableGamesCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === "availableGames"
    )[1];

    //simulate receiving a list with one available game
    const mockAvailableGames = [{ gameSessionID: "test-game-123" }];
    availableGamesCallback(mockAvailableGames);

    //verify that it emits joinExistingGame with the first game's session id
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "joinExistingGame",
      mockAvailableGames[0].gameSessionID
    );
  });

  test("should create new game when no games are available", () => {
    //call the function with mock socket
    joinExistingGameOrCreateNewChessGame(mockSocket);

    //get the availableGames callback function that was registered
    const availableGamesCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === "availableGames"
    )[1];

    //simulate receiving an empty list
    const mockAvailableGames = [];
    availableGamesCallback(mockAvailableGames);

    //verify that it emits createNewChessGame
    expect(mockSocket.emit).toHaveBeenCalledWith("createNewChessGame");
  });
});
