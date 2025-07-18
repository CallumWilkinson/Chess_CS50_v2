import { jest } from "@jest/globals";
import Database from "../backend/gameSetup/Database.js";
import Player from "../backend/gameSetup/Player.js";
import GameSession from "../backend/gameSetup/gameSession.js";

//test suite for the database class that manages game sessions and players
describe("Database class", () => {
  let database;

  //create a fresh database instance before each test
  beforeEach(() => {
    database = new Database();
  });

  //test basic player management functionality
  describe("player management", () => {
    test("addPlayer stores player object with socket id", () => {
      const testPlayer = new Player("testuser", "socket123");
      
      database.addPlayer("socket123", testPlayer);
      
      expect(database.connectedPlayers["socket123"]).toEqual(testPlayer);
    });

    test("removePlayer deletes player from database", () => {
      const testPlayer = new Player("testuser", "socket123");
      database.addPlayer("socket123", testPlayer);
      
      database.removePlayer("socket123");
      
      expect(database.connectedPlayers["socket123"]).toBeUndefined();
    });

    test("getPlayerBySocketId returns correct player object", () => {
      const testPlayer = new Player("testuser", "socket123");
      database.addPlayer("socket123", testPlayer);
      
      const result = database.getPlayerBySocketId("socket123");
      
      expect(result).toEqual(testPlayer);
    });

    test("getPlayerBySocketId returns undefined for non-existent player", () => {
      const result = database.getPlayerBySocketId("nonexistent");
      
      expect(result).toBeUndefined();
    });
  });

  //test game session management functionality
  describe("session management", () => {
    test("createSession stores session object with session id", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      
      database.createSession("session123", testSession);
      
      expect(database.gameSessions["session123"]).toEqual(testSession);
    });

    test("deleteSession removes session from database", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      database.createSession("session123", testSession);
      
      database.deleteSession("session123");
      
      expect(database.gameSessions["session123"]).toBeUndefined();
    });

    test("getSessionById returns correct session object", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      database.createSession("session123", testSession);
      
      const result = database.getSessionById("session123");
      
      expect(result).toEqual(testSession);
    });

    test("getSessionById returns undefined for non-existent session", () => {
      const result = database.getSessionById("nonexistent");
      
      expect(result).toBeUndefined();
    });

    test("sessionExists returns true for existing session", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      database.createSession("session123", testSession);
      
      const result = database.sessionExists("session123");
      
      expect(result).toBe(true);
    });

    test("sessionExists returns false for non-existent session", () => {
      const result = database.sessionExists("nonexistent");
      
      expect(result).toBe(false);
    });
  });

  //test socket to session mapping functionality
  describe("socket to session mapping", () => {
    test("mapSocketToSession creates mapping between socket and session", () => {
      database.mapSocketToSession("socket123", "session456");
      
      expect(database.socketIDtoGameSessionID["socket123"]).toBe("session456");
    });

    test("unmapSocketFromSession removes mapping", () => {
      database.mapSocketToSession("socket123", "session456");
      
      database.unmapSocketFromSession("socket123");
      
      expect(database.socketIDtoGameSessionID["socket123"]).toBeUndefined();
    });

    test("getSessionIdBySocket returns correct session id", () => {
      database.mapSocketToSession("socket123", "session456");
      
      const result = database.getSessionIdBySocket("socket123");
      
      expect(result).toBe("session456");
    });

    test("getSessionIdBySocket returns undefined for unmapped socket", () => {
      const result = database.getSessionIdBySocket("nonexistent");
      
      expect(result).toBeUndefined();
    });
  });

  //test player count functionality
  describe("player count tracking", () => {
    test("getPlayerCountInSession returns 0 for non-existent session", () => {
      const result = database.getPlayerCountInSession("nonexistent");
      
      expect(result).toBe(0);
    });

    test("getPlayerCountInSession returns correct count for session with players", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      database.createSession("session123", testSession);
      
      //add players to the session via socket mapping
      database.mapSocketToSession("socket1", "session123");
      database.mapSocketToSession("socket2", "session123");
      
      const result = database.getPlayerCountInSession("session123");
      
      expect(result).toBe(2);
    });

    test("getPlayerCountInSession returns 0 for empty session", () => {
      const testSession = new GameSession();
      testSession.gameSessionID = "session123";
      database.createSession("session123", testSession);
      
      const result = database.getPlayerCountInSession("session123");
      
      expect(result).toBe(0);
    });
  });

  //test available games listing functionality
  describe("available games listing", () => {
    test("getAvailableGames returns empty array when no sessions exist", () => {
      const result = database.getAvailableGames();
      
      expect(result).toEqual([]);
    });

    test("getAvailableGames returns empty array when no sessions have exactly 1 player", () => {
      //create session with 0 players
      const emptySession = new GameSession();
      emptySession.gameSessionID = "empty123";
      database.createSession("empty123", emptySession);
      
      //create session with 2 players  
      const fullSession = new GameSession();
      fullSession.gameSessionID = "full123";
      database.createSession("full123", fullSession);
      database.mapSocketToSession("socket1", "full123");
      database.mapSocketToSession("socket2", "full123");
      
      const result = database.getAvailableGames();
      
      expect(result).toEqual([]);
    });

    test("getAvailableGames returns session info when session has exactly 1 player", () => {
      const waitingSession = new GameSession();
      waitingSession.gameSessionID = "waiting123";
      database.createSession("waiting123", waitingSession);
      
      //add one player to the session
      const testPlayer = new Player("waitingplayer", "socket1");
      database.addPlayer("socket1", testPlayer);
      database.mapSocketToSession("socket1", "waiting123");
      
      const result = database.getAvailableGames();
      
      expect(result).toEqual([{
        gameSessionID: "waiting123",
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
      session1.gameSessionID = "waiting1";
      database.createSession("waiting1", session1);
      
      const session2 = new GameSession();
      session2.gameSessionID = "waiting2";
      database.createSession("waiting2", session2);
      
      //add one player to each session
      const testPlayer1 = new Player("player1", "socket1");
      const testPlayer2 = new Player("player2", "socket2");
      database.addPlayer("socket1", testPlayer1);
      database.addPlayer("socket2", testPlayer2);
      database.mapSocketToSession("socket1", "waiting1");
      database.mapSocketToSession("socket2", "waiting2");
      
      const result = database.getAvailableGames();
      
      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining([
        {
          gameSessionID: "waiting1",
          waitingPlayer: { username: "player1", colour: "black" },
          playersConnected: 1,
          maxPlayers: 2
        },
        {
          gameSessionID: "waiting2",
          waitingPlayer: { username: "player2", colour: "black" },
          playersConnected: 1,
          maxPlayers: 2
        }
      ]));
    });
  });
});