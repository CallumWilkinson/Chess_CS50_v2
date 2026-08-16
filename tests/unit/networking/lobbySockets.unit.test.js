import { jest } from "@jest/globals";
import { launchServer } from "../../../backend/gameSetup/launchServer.js";
import {
  createMockSocket,
  createMockIOServer,
} from "../../helpers/testUtils.js";

describe("Lobby socket events", () => {
  let io;
  let socketA;
  let socketB;
  let rooms;
  let connectionHandler;

  beforeEach(() => {
    rooms = {};
    socketA = createMockSocket(undefined, rooms);
    socketB = createMockSocket(undefined, rooms);
    io = createMockIOServer(rooms);

    const originalOn = io.on;
    io.on = jest.fn((event, cb) => {
      if (event === "connection") {
        connectionHandler = cb;
        cb(socketA);
        cb(socketB);
      }
      return originalOn(event, cb);
    });

    launchServer(io);
  });

  afterEach(() => {
    jest.clearAllMocks();
    connectionHandler = undefined;
  });

  test("lobby:create reserves a session without exposing it as an available lobby", () => {
    const ack = jest.fn();

    const payload = {
      lobbyName: "Alpha Room",
      colour: "white",
    };

    socketA.simulateIncoming("lobby:create", payload, ack);

    expect(ack).toHaveBeenCalledTimes(1);

    const ackArg = ack.mock.calls[0][0];

    expect(ackArg).toEqual(
      expect.objectContaining({
        gameSessionID: expect.any(String),
      }),
    );

    expect(io.emit).toHaveBeenCalledWith("lobbies:updated", {
      lobbies: [],
    });
  });

  test("lobby:list returns a lobby after its first player joins", () => {
    // Given
    const ackCreate = jest.fn();

    socketA.simulateIncoming(
      "lobby:create",
      {
        lobbyName: "Bravo Room",
        colour: "black",
      },
      ackCreate,
    );

    const sessionId = ackCreate.mock.calls[0][0].gameSessionID;

    // Creator reaches game page and becomes player 1.
    const ackJoin = jest.fn();

    socketB.simulateIncoming(
      "lobby:join",
      {
        gameSessionID: sessionId,
      },
      ackJoin,
    );

    // When
    const ackList = jest.fn();

    socketA.simulateIncoming("lobby:list", {}, ackList);

    // Then
    expect(ackList).toHaveBeenCalledTimes(1);

    const listPayload = ackList.mock.calls[0][0];

    expect(listPayload).toEqual(
      expect.objectContaining({
        lobbies: expect.arrayContaining([
          expect.objectContaining({
            lobbyName: "Bravo Room",
            playersConnected: 1,
          }),
        ]),
      }),
    );
  });

  test("first lobby:join adds the first player and keeps the lobby available", () => {
    const ackCreate = jest.fn();
    socketA.simulateIncoming(
      "lobby:create",
      { lobbyName: "Charlie Room", colour: "white" },
      ackCreate,
    );
    const sessionId = ackCreate.mock.calls[0][0].gameSessionID;

    const ackJoin = jest.fn();
    socketB.simulateIncoming(
      "lobby:join",
      { gameSessionID: sessionId },
      ackJoin,
    );

    expect(ackJoin).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    expect(socketB.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.stringMatching(/^(black|white)$/),
        gameInstance: expect.any(Object),
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      }),
    );

    const rosterBroadcast = io.__toEmitMock.mock.calls.find(
      (call) => call[0] === "session:players",
    );
    expect(rosterBroadcast).toBeDefined();
    expect(rosterBroadcast[1]).toEqual(
      expect.objectContaining({
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      }),
    );

    expect(io.emit).toHaveBeenCalledWith(
      "lobbies:updated",
      expect.objectContaining({ lobbies: expect.any(Array) }),
    );
    const lastUpdate = io.emit.mock.calls
      .filter(([event]) => event === "lobbies:updated")
      .pop()[1];
    const updatedLobby = lastUpdate.lobbies.find(
      (lobby) => lobby.lobbyName === "Charlie Room",
    );

    expect(updatedLobby).toEqual(
      expect.objectContaining({
        lobbyName: "Charlie Room",
        playersConnected: 1,
      }),
    );
  });

  test("second lobby:join fills the session and removes it from available lobbies", () => {
    // Given
    const ackCreate = jest.fn();

    socketA.simulateIncoming(
      "lobby:create",
      {
        lobbyName: "Charlie Room",
      },
      ackCreate,
    );

    const sessionId = ackCreate.mock.calls[0][0].gameSessionID;

    // First actual player joins.
    const firstJoinAck = jest.fn();

    socketB.simulateIncoming(
      "lobby:join",
      {
        gameSessionID: sessionId,
      },
      firstJoinAck,
    );

    // Second actual player joins.
    const secondJoinAck = jest.fn();

    socketA.simulateIncoming(
      "lobby:join",
      {
        gameSessionID: sessionId,
      },
      secondJoinAck,
    );

    // Then
    expect(firstJoinAck).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
      }),
    );

    expect(secondJoinAck).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
      }),
    );

    const lastUpdate = io.emit.mock.calls
      .filter(([event]) => event === "lobbies:updated")
      .pop()[1];

    expect(
      lastUpdate.lobbies.find((lobby) => lobby.lobbyName === "Charlie Room"),
    ).toBeUndefined();
  });

  test("lobby:create rejects duplicate names (case-insensitive)", () => {
    const ack1 = jest.fn();
    const ack2 = jest.fn();

    socketA.simulateIncoming(
      "lobby:create",
      { lobbyName: "Delta Room", colour: "white" },
      ack1,
    );
    socketB.simulateIncoming(
      "lobby:create",
      { lobbyName: "delta  room" },
      ack2,
    );

    expect(ack2).toHaveBeenCalledTimes(1);
    expect(ack2.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: "NAME_TAKEN" }),
      }),
    );
  });

  test("lobby:join returns error for non-existent session", () => {
    const ack = jest.fn();
    socketB.simulateIncoming(
      "lobby:join",
      { gameSessionID: "nonexistent" },
      ack,
    );
    expect(ack).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: "SESSION_NOT_FOUND" }),
      }),
    );
  });

  test("lobby:list returns empty array when no lobbies", () => {
    const ack = jest.fn();
    socketA.simulateIncoming("lobby:list", {}, ack);
    expect(ack).toHaveBeenCalledWith(expect.objectContaining({ lobbies: [] }));
  });
});
