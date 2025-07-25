import { jest } from "@jest/globals";
import SessionManager from "../backend/gameSetup/SessionManager.js";
import Player from "../backend/gameSetup/Player.js";
import GameSession from "../backend/gameSetup/gameSession.js";

//test suite for the session manager class that manages game sessions and players
describe("SessionManager class", () => {
  let sessionManager;

  //create a fresh session manager instance before each test
  beforeEach(() => {
    sessionManager = new SessionManager();
  });

  //test basic player management functionality
  describe("player management", () => {
    test("addPlayer stores player object with socket id", () => {
      const testPlayer = new Player("testuser", "socket123");
      
      sessionManager.addPlayer("socket123", testPlayer);
      
      expect(sessionManager.connectedPlayers["socket123"]).toEqual(testPlayer);
    });

    test("removePlayer deletes player from sessionManager", () => {
      const testPlayer = new Player("testuser", "socket123");
      sessionManager.addPlayer("socket123", testPlayer);
      
      sessionManager.removePlayer("socket123");
      
      expect(sessionManager.connectedPlayers["socket123"]).toBeUndefined();
    });

    test("getPlayerBySocketId returns correct player object", () => {
      const testPlayer = new Player("testuser", "socket123");
      sessionManager.addPlayer("socket123", testPlayer);
      
      const result = sessionManager.getPlayerBySocketId("socket123");
      
      expect(result).toEqual(testPlayer);
    });

    test("getPlayerBySocketId returns undefined for non-existent player", () => {
      const result = sessionManager.getPlayerBySocketId("nonexistent");
      
      expect(result).toBeUndefined();
    });
  });

  //test game session management functionality
  describe("session management", () => {
    test("addSession stores session object with session id", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      
      sessionManager.addSession(sessionId, testSession);
      
      expect(sessionManager.gameSessions[sessionId]).toEqual(testSession);
    });

    test("removeSession removes session from sessionManager", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      sessionManager.addSession(sessionId, testSession);
      
      sessionManager.removeSession(sessionId);
      
      expect(sessionManager.gameSessions[sessionId]).toBeUndefined();
    });

    test("getSessionById returns correct session object", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      sessionManager.addSession(sessionId, testSession);
      
      const result = sessionManager.getSessionById(sessionId);
      
      expect(result).toEqual(testSession);
    });

    test("getSessionById returns undefined for non-existent session", () => {
      const result = sessionManager.getSessionById("nonexistent");
      
      expect(result).toBeUndefined();
    });

    test("sessionExists returns true for existing session", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      sessionManager.addSession(sessionId, testSession);
      
      const result = sessionManager.sessionExists(sessionId);
      
      expect(result).toBe(true);
    });

    test("sessionExists returns false for non-existent session", () => {
      const result = sessionManager.sessionExists("nonexistent");
      
      expect(result).toBe(false);
    });
  });

  //test socket to session mapping functionality
  describe("socket to session mapping", () => {
    test("mapSocketToSession creates mapping between socket and session", () => {
      sessionManager.mapSocketToSession("socket123", "session456");
      
      expect(sessionManager.socketIDtoGameSessionID["socket123"]).toBe("session456");
    });

    test("unmapSocketFromSession removes mapping", () => {
      sessionManager.mapSocketToSession("socket123", "session456");
      
      sessionManager.unmapSocketFromSession("socket123");
      
      expect(sessionManager.socketIDtoGameSessionID["socket123"]).toBeUndefined();
    });

    test("getSessionIdBySocket returns correct session id", () => {
      sessionManager.mapSocketToSession("socket123", "session456");
      
      const result = sessionManager.getSessionIdBySocket("socket123");
      
      expect(result).toBe("session456");
    });

    test("getSessionIdBySocket returns undefined for unmapped socket", () => {
      const result = sessionManager.getSessionIdBySocket("nonexistent");
      
      expect(result).toBeUndefined();
    });
  });

  //test player count functionality
  describe("player count tracking", () => {
    test("getPlayerCountInSession returns 0 for non-existent session", () => {
      const result = sessionManager.getPlayerCountInSession("nonexistent");
      
      expect(result).toBe(0);
    });

    test("getPlayerCountInSession returns correct count for session with players", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      
      //add players to connectedUsers (single source of truth)
      const player1 = new Player("player1", "socket1", "black");
      const player2 = new Player("player2", "socket2", "white");
      testSession.addPlayerToSession(player1);
      testSession.addPlayerToSession(player2);
      
      sessionManager.addSession(sessionId, testSession);
      
      const result = sessionManager.getPlayerCountInSession(sessionId);
      
      expect(result).toBe(2);
    });

    test("getPlayerCountInSession returns 0 for empty session", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      sessionManager.addSession(sessionId, testSession);
      
      const result = sessionManager.getPlayerCountInSession(sessionId);
      
      expect(result).toBe(0);
    });
  });

  //test available games listing functionality
  describe("available games listing", () => {
    test("getAvailableGames returns empty array when no sessions exist", () => {
      const result = sessionManager.getAvailableGames();
      
      expect(result).toEqual([]);
    });

    test("getAvailableGames returns empty array when no sessions have exactly 1 player", () => {
      //create session with 0 players
      const emptySession = new GameSession();
      const emptySessionId = emptySession.gameSessionID;
      sessionManager.addSession(emptySessionId, emptySession);
      
      //create session with 2 players using connectedUsers
      const fullSession = new GameSession();
      const fullSessionId = fullSession.gameSessionID;
      const player1 = new Player("player1", "socket1", "black");
      const player2 = new Player("player2", "socket2", "white");
      fullSession.addPlayerToSession(player1);
      fullSession.addPlayerToSession(player2);
      sessionManager.addSession(fullSessionId, fullSession);
      
      const result = sessionManager.getAvailableGames();
      
      expect(result).toEqual([]);
    });

    test("getAvailableGames returns session info when session has exactly 1 player", () => {
      const waitingSession = new GameSession();
      const sessionId = waitingSession.gameSessionID;
      sessionManager.addSession(sessionId, waitingSession);
      
      //add one player to the session using connectedUsers
      const testPlayer = new Player("waitingplayer", "socket1", "black");
      waitingSession.addPlayerToSession(testPlayer);
      
      const result = sessionManager.getAvailableGames();
      
      expect(result).toEqual([{
        gameSessionID: sessionId,
        waitingPlayer: {
          username: "waitingplayer",
          colour: "black"
        },
        playersConnected: 1,
        maxPlayers: 2
      }]);
    });

    test("getAvailableGames returns multiple sessions when multiple have 1 player", () => {
      const session1 = new GameSession();
      const sessionId1 = session1.gameSessionID;
      sessionManager.addSession(sessionId1, session1);
      
      const session2 = new GameSession();
      const sessionId2 = session2.gameSessionID;
      sessionManager.addSession(sessionId2, session2);
      
      //add one player to each session using connectedUsers
      const testPlayer1 = new Player("player1", "socket1", "black");
      const testPlayer2 = new Player("player2", "socket2", "black");
      session1.addPlayerToSession(testPlayer1);
      session2.addPlayerToSession(testPlayer2);
      
      const result = sessionManager.getAvailableGames();
      
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([
        {
          gameSessionID: sessionId1,
          waitingPlayer: { username: "player1", colour: "black" },
          playersConnected: 1,
          maxPlayers: 2
        },
        {
          gameSessionID: sessionId2,
          waitingPlayer: { username: "player2", colour: "black" },
          playersConnected: 1,
          maxPlayers: 2
        }
      ]));
    });
  });

  //test unified player color assignment functionality

  //test move handling support methods
  describe("move handling operations", () => {
    test("getGameInstanceBySocket returns game instance for valid socket", () => {
      const testSession = new GameSession();
      const testInstance = testSession.createGameInstance();
      const sessionId = testSession.gameSessionID;
      
      sessionManager.addSession(sessionId, testSession);
      sessionManager.mapSocketToSession("socket1", sessionId);
      
      const result = sessionManager.getGameInstanceBySocket("socket1");
      
      expect(result).toBe(testInstance);
    });

    test("getGameInstanceBySocket returns null for unmapped socket", () => {
      const result = sessionManager.getGameInstanceBySocket("nonexistent");
      
      expect(result).toBeNull();
    });

    test("getGameInstanceBySocket returns null for socket in non-existent session", () => {
      sessionManager.mapSocketToSession("socket1", "nonexistent");
      
      const result = sessionManager.getGameInstanceBySocket("socket1");
      
      expect(result).toBeNull();
    });


    test("getPlayersInSession returns connectedUsers array for valid session", () => {
      const testSession = new GameSession();
      const sessionId = testSession.gameSessionID;
      
      const blackPlayer = new Player("player1", "socket1", "black");
      const whitePlayer = new Player("player2", "socket2", "white");
      
      //add players to connectedUsers (single source of truth)
      testSession.addPlayerToSession(blackPlayer);
      testSession.addPlayerToSession(whitePlayer);
      
      sessionManager.addSession(sessionId, testSession);
      
      const result = sessionManager.getPlayersInSession(sessionId);
      
      expect(result).toEqual([blackPlayer, whitePlayer]);
    });

    test("getPlayersInSession returns null for non-existent session", () => {
      const result = sessionManager.getPlayersInSession("nonexistent");
      
      expect(result).toBeNull();
    });
  });
});