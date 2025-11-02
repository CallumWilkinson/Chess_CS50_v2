import { jest } from "@jest/globals";
import joinExistingGameOrCreateNewChessGame, {
  joinPendingSessionFromStorage,
} from "../../../public/src/frontend/adapters/socket/joinExistingGameOrCreateNewChessGame.js";

describe("joinExistingGameOrCreateNewChessGame", () => {
  let mockSocket;
  let handlers;

  beforeEach(() => {
    handlers = {};
    mockSocket = {
      on: jest.fn((event, handler) => {
        handlers[event] = handler;
      }),
      once: jest.fn((event, handler) => {
        handlers[event] = handler;
      }),
      emit: jest.fn(),
      connected: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return early if no socket is provided", () => {
    joinExistingGameOrCreateNewChessGame(null);

    expect(mockSocket.on).not.toHaveBeenCalled();
    expect(mockSocket.once).not.toHaveBeenCalled();
  });

  test("should set up connect listener that requests available games", () => {
    joinExistingGameOrCreateNewChessGame(mockSocket);

    expect(mockSocket.once).toHaveBeenCalledWith("connect", expect.any(Function));

    const connectCallback = mockSocket.once.mock.calls.find((call) => call[0] === "connect")[1];
    connectCallback();

    expect(mockSocket.emit).toHaveBeenCalledWith("getAvailableGames");
  });

  test("should set up availableGames listener", () => {
    joinExistingGameOrCreateNewChessGame(mockSocket);

    expect(mockSocket.on).toHaveBeenCalledWith("availableGames", expect.any(Function));
  });

  test("should join existing game when games are available", () => {
    joinExistingGameOrCreateNewChessGame(mockSocket);

    const availableGamesCallback = handlers.availableGames;

    availableGamesCallback([{ gameSessionID: "test-game-123" }]);

    expect(mockSocket.emit).toHaveBeenCalledWith("joinExistingGame", "test-game-123");
  });

  test("should create new game when no games are available", () => {
    joinExistingGameOrCreateNewChessGame(mockSocket);

    const availableGamesCallback = handlers.availableGames;
    availableGamesCallback([]);

    expect(mockSocket.emit).toHaveBeenCalledWith("createNewChessGame");
  });

  test("should request available games immediately when socket already connected", () => {
    mockSocket.connected = true;

    joinExistingGameOrCreateNewChessGame(mockSocket);

    expect(mockSocket.emit).toHaveBeenCalledWith("getAvailableGames");
    expect(mockSocket.once).not.toHaveBeenCalledWith("connect", expect.any(Function));
  });
});

describe("joinPendingSessionFromStorage", () => {
  let storage;
  let socket;

  beforeEach(() => {
    storage = window.sessionStorage;
    storage.clear();
    socket = {
      emit: jest.fn(),
    };
  });

  afterEach(() => {
    storage.clear();
    jest.clearAllMocks();
  });

  test("returns attempted false when no pending session is stored", async () => {
    const result = await joinPendingSessionFromStorage({ socket, storage });

    expect(result).toEqual({ attempted: false });
    expect(socket.emit).not.toHaveBeenCalled();
  });

  test("removes corrupt payload and skips join", async () => {
    storage.setItem("pendingGameSession", "not-json");

    const result = await joinPendingSessionFromStorage({ socket, storage });

    expect(result).toEqual({ attempted: false });
    expect(storage.getItem("pendingGameSession")).toBeNull();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  test("sends lobby:join and resolves with success metadata", async () => {
    storage.setItem(
      "pendingGameSession",
      JSON.stringify({ gameSessionID: "session-1", lobbyName: "Alpha" })
    );

    socket.emit.mockImplementation((event, payload, ack) => {
      ack({ ok: true });
    });

    const result = await joinPendingSessionFromStorage({ socket, storage });

    expect(socket.emit).toHaveBeenCalledWith(
      "lobby:join",
      { gameSessionID: "session-1" },
      expect.any(Function)
    );
    expect(result).toEqual({ attempted: true, ok: true, gameSessionID: "session-1" });
    expect(storage.getItem("pendingGameSession")).toBeNull();
  });

  test("returns error information when join fails", async () => {
    storage.setItem(
      "pendingGameSession",
      JSON.stringify({ gameSessionID: "session-2", lobbyName: "Beta" })
    );

    socket.emit.mockImplementation((event, payload, ack) => {
      ack({ error: { message: "Session full" } });
    });

    const result = await joinPendingSessionFromStorage({ socket, storage });

    expect(result).toEqual({
      attempted: true,
      ok: false,
      error: { message: "Session full" },
      gameSessionID: "session-2",
    });
  });
});

