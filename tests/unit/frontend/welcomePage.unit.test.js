import { jest } from "@jest/globals";

describe("initializeWelcomePage", () => {
  let createButton;
  let joinButton;
  let mockWindow;
  let mockDocument;
  let mockSocket;
  let initializeWelcomePage;

  beforeEach(async () => {
    jest.unstable_mockModule(
      "../../../public/src/frontend/setupAuthentication.js",
      () => ({
        setupSocketWithAuthentication: jest.fn(),
      })
    );

    document.body.innerHTML = `
      <main>
        <a id="create" data-create-game-button href="#create">Create New Game</a>
        <a id="join" data-join-game-button href="#join">Join Existing Game</a>
      </main>
    `;

    createButton = document.getElementById("create");
    joinButton = document.getElementById("join");

    mockSocket = {
      emit: jest.fn(),
      on: jest.fn(),
      connect: jest.fn(),
      auth: { username: "HostUser" },
    };

    mockWindow = {
      prompt: jest.fn(),
      alert: jest.fn(),
      sessionStorage: window.sessionStorage,
      location: { assign: jest.fn() },
    };

    mockDocument = document;

    const module = await import("../../../public/welcome.js");
    initializeWelcomePage = module.initializeWelcomePage;
  });

  afterEach(() => {
    window.sessionStorage.clear();
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("attaches click handlers to create and join links", () => {
    const createSocket = jest.fn(() => mockSocket);

    initializeWelcomePage({
      document: mockDocument,
      window: mockWindow,
      createSocket,
    });

    createButton.click();
    joinButton.click();

    expect(mockWindow.prompt).toHaveBeenCalled();
    expect(createSocket).toHaveBeenCalledTimes(1);
    expect(createSocket).toHaveBeenCalledWith(
      expect.objectContaining({ promptUser: null })
    );
  });

  test("sends lobby:create, stores session, and redirects on success", () => {
    const createSocket = jest.fn(() => mockSocket);
    mockWindow.prompt.mockReturnValue("  Alpha Lobby  ");

    initializeWelcomePage({
      document: mockDocument,
      window: mockWindow,
      createSocket,
    });

    createButton.click();

    const emitArgs = mockSocket.emit.mock.calls.find(
      ([event]) => event === "lobby:create"
    );
    expect(emitArgs).toBeDefined();

    const [, payload, ack] = emitArgs;
    expect(payload).toEqual({ lobbyName: "Alpha Lobby" });
    expect(mockSocket.connect).toHaveBeenCalledTimes(1);

    ack({ gameSessionID: "game-123" });

    const stored = window.sessionStorage.getItem("pendingGameSession");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored);
    expect(parsed).toEqual(
      expect.objectContaining({
        gameSessionID: "game-123",
        lobbyName: "Alpha Lobby",
        username: "HostUser",
      })
    );

    expect(mockWindow.location.assign).toHaveBeenCalledWith("index.html");
  });

  test("alerts when lobby name is empty and does not emit", () => {
    const createSocket = jest.fn(() => mockSocket);
    mockWindow.prompt.mockReturnValue("   ");

    initializeWelcomePage({
      document: mockDocument,
      window: mockWindow,
      createSocket,
    });

    createButton.click();

    expect(mockWindow.alert).toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
    expect(mockWindow.location.assign).not.toHaveBeenCalled();
  });

  test("surfaces server error through alert and skips redirect", () => {
    const createSocket = jest.fn(() => mockSocket);
    mockWindow.prompt.mockReturnValue("Bravo Lobby");

    initializeWelcomePage({
      document: mockDocument,
      window: mockWindow,
      createSocket,
    });

    createButton.click();

    const emitArgs = mockSocket.emit.mock.calls.find(
      ([event]) => event === "lobby:create"
    );
    const ack = emitArgs[2];
    ack({ error: { message: "Lobby name already taken" } });

    expect(mockWindow.alert).toHaveBeenCalledWith("Lobby name already taken");
    expect(mockWindow.location.assign).not.toHaveBeenCalled();
  });
});
