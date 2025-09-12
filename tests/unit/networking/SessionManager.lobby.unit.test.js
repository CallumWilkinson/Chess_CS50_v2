import SessionManager from "../../../backend/gameSetup/SessionManager.js";
import { createGameSessionWithPlayers, TEST_PLAYERS } from "../../helpers/testFactories.js";

describe("SessionManager lobby name index", () => {
  let sessionManager;

  beforeEach(() => {
    sessionManager = new SessionManager();
  });

  test("isLobbyNameAvailable returns true for new valid name and false after registration (case-insensitive)", () => {
    const name = "  Alpha   Room  ";
    const sessionId = "session-123";

    expect(sessionManager.isLobbyNameAvailable(name)).toBe(true);

    sessionManager.registerLobbyName(name, sessionId);

    expect(sessionManager.isLobbyNameAvailable("alpha room")).toBe(false);
    expect(sessionManager.findSessionIdByLobbyName("ALPHA ROOM")).toBe(sessionId);
  });

  test("unregisterLobbyName frees the name for reuse", () => {
    const name = "Bravo Room";
    const sessionId = "bravo-1";

    sessionManager.registerLobbyName(name, sessionId);
    expect(sessionManager.isLobbyNameAvailable(name)).toBe(false);

    sessionManager.unregisterLobbyName(name);
    expect(sessionManager.isLobbyNameAvailable(name)).toBe(true);
  });

  test("isLobbyNameAvailable returns false for invalid names", () => {
    const invalidNames = [
      "", //empty
      "  ", //whitespace
      "ab", //too short (<3)
      "ThisNameIsWayTooLongBeyondTwentyFourChars", //too long
      "bad!!", //invalid chars
    ];

    invalidNames.forEach((n) => {
      expect(sessionManager.isLobbyNameAvailable(n)).toBe(false);
    });
  });

  test("getAvailableGames includes lobbyName in listing objects", () => {
    const waitingSession = createGameSessionWithPlayers(TEST_PLAYERS.CHESS_WAITING_GAME);
    waitingSession.lobbyName = "Test Room";

    sessionManager.addSession(waitingSession.gameSessionID, waitingSession);

    const result = sessionManager.getAvailableGames();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      gameSessionID: waitingSession.gameSessionID,
      lobbyName: "Test Room",
      playersConnected: 1,
      maxPlayers: 2,
    });
  });
});

