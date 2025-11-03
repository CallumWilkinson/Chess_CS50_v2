import { jest } from "@jest/globals";
import { joinPendingSessionFromStorage } from "../../../public/src/frontend/adapters/socket/joinExistingGameOrCreateNewChessGame.js";

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
    expect(result).toEqual({
      attempted: true,
      ok: true,
      gameSessionID: "session-1",
    });
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
