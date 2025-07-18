import { jest } from "@jest/globals";
import Database from "../backend/gameSetup/Database.js";
import GameSession from "../backend/gameSetup/gameSession.js";
import GameInstance from "../backend/gameSetup/GameInstance.js";
import Player from "../backend/gameSetup/Player.js";

//test suite for unified color assignment functionality across Database, GameSession, and GameInstance
describe("Unified Color Assignment Integration", () => {
  let database;
  let gameSession;
  let gameInstance;

  //create fresh instances before each test
  beforeEach(() => {
    database = new Database();
    gameSession = new GameSession();
    gameInstance = new GameInstance("test123");
  });

  //test that GameSession uses database color assignment when database is provided
  describe("GameSession integration with Database", () => {
    test("getPlayerColour uses database.assignPlayerColor when database provided", () => {
      const players = {};
      
      const result = gameSession.getPlayerColour(players, database);
      
      expect(result).toBe("black");
    });

    test("getPlayerColour uses database logic for white assignment", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const players = {
        socket1: blackPlayer
      };
      
      const result = gameSession.getPlayerColour(players, database);
      
      expect(result).toBe("white");
    });

    test("getPlayerColour falls back to legacy logic when no database provided", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const players = {
        socket1: blackPlayer
      };
      
      const result = gameSession.getPlayerColour(players);
      
      expect(result).toBe("white");
    });

    test("getPlayerColour handles null database gracefully", () => {
      const players = {};
      
      const result = gameSession.getPlayerColour(players, null);
      
      expect(result).toBe("black");
    });
  });

  //test that GameInstance uses database color assignment when database is provided
  describe("GameInstance integration with Database", () => {
    test("addPlayersToInstance uses database.assignPlayerColor when database provided", () => {
      const connectedUsers = {};
      
      const result = gameInstance.addPlayersToInstance(connectedUsers, database);
      
      expect(result).toBe("black");
    });

    test("addPlayersToInstance uses database logic for white assignment", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const connectedUsers = {
        socket1: blackPlayer
      };
      
      const result = gameInstance.addPlayersToInstance(connectedUsers, database);
      
      expect(result).toBe("white");
    });

    test("addPlayersToInstance falls back to legacy logic when no database provided", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const connectedUsers = {
        socket1: blackPlayer
      };
      
      const result = gameInstance.addPlayersToInstance(connectedUsers);
      
      expect(result).toBe("white");
    });

    test("addPlayersToInstance handles null database gracefully", () => {
      const connectedUsers = {};
      
      const result = gameInstance.addPlayersToInstance(connectedUsers, null);
      
      expect(result).toBe("black");
    });
  });

  //test consistency between all three methods
  describe("Cross-class consistency", () => {
    test("all methods return same result for same input - empty players", () => {
      const players = {};
      
      const databaseResult = database.assignPlayerColor(players);
      const gameSessionResult = gameSession.getPlayerColour(players, database);
      const gameInstanceResult = gameInstance.addPlayersToInstance(players, database);
      
      expect(databaseResult).toBe("black");
      expect(gameSessionResult).toBe("black");
      expect(gameInstanceResult).toBe("black");
    });

    test("all methods return same result for same input - black player exists", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const players = {
        socket1: blackPlayer
      };
      
      const databaseResult = database.assignPlayerColor(players);
      const gameSessionResult = gameSession.getPlayerColour(players, database);
      const gameInstanceResult = gameInstance.addPlayersToInstance(players, database);
      
      expect(databaseResult).toBe("white");
      expect(gameSessionResult).toBe("white");
      expect(gameInstanceResult).toBe("white");
    });

    test("all methods return same result for same input - white player exists", () => {
      const whitePlayer = new Player("player1", "socket1", "white");
      const players = {
        socket1: whitePlayer
      };
      
      const databaseResult = database.assignPlayerColor(players);
      const gameSessionResult = gameSession.getPlayerColour(players, database);
      const gameInstanceResult = gameInstance.addPlayersToInstance(players, database);
      
      expect(databaseResult).toBe("black");
      expect(gameSessionResult).toBe("black");
      expect(gameInstanceResult).toBe("black");
    });

    test("legacy methods still work independently", () => {
      const blackPlayer = new Player("player1", "socket1", "black");
      const players = {
        socket1: blackPlayer
      };
      
      //test without database - should use legacy logic
      const gameSessionLegacy = gameSession.getPlayerColour(players);
      const gameInstanceLegacy = gameInstance.addPlayersToInstance(players);
      
      expect(gameSessionLegacy).toBe("white");
      expect(gameInstanceLegacy).toBe("white");
    });
  });

  //test edge cases work consistently across all methods
  describe("Edge case consistency", () => {
    test("all methods handle null players consistently", () => {
      const databaseResult = database.assignPlayerColor(null);
      const gameSessionResult = gameSession.getPlayerColour(null, database);
      const gameInstanceResult = gameInstance.addPlayersToInstance(null, database);
      
      expect(databaseResult).toBe("black");
      expect(gameSessionResult).toBe("black");
      expect(gameInstanceResult).toBe("black");
    });

    test("all methods handle undefined players consistently", () => {
      const databaseResult = database.assignPlayerColor(undefined);
      const gameSessionResult = gameSession.getPlayerColour(undefined, database);
      const gameInstanceResult = gameInstance.addPlayersToInstance(undefined, database);
      
      expect(databaseResult).toBe("black");
      expect(gameSessionResult).toBe("black");
      expect(gameInstanceResult).toBe("black");
    });
  });
});