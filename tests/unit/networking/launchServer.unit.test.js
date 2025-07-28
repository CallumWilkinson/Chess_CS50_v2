import { jest } from "@jest/globals";
import { createMockSocket, createMockIOServer } from "../../helpers/testUtils.js";
import { createGameSessionWithPlayers, createTestScenario, TEST_PLAYERS } from "../../helpers/testFactories.js";

//these are mock functions that replace the real functions during testing
//this allows us to test launchServer.js without depending on other modules
//jest.fn() creates a fake function that tracks when/how it's called
const mockHandleMove = jest.fn();
const mockGameSession = jest.fn();
const mockPlayer = jest.fn();

//jest.unstable_mockModule replaces the real modules with fake ones
//this way when launchServer.js tries to import these modules, it gets our mocks instead
//we do this to isolate the code we want to test (launchServer.js)
jest.unstable_mockModule("../../../backend/helpers/handleMove.js", () => ({
  handleMove: mockHandleMove,
}));

jest.unstable_mockModule("../../../backend/gameSetup/gameSession.js", () => ({
  default: mockGameSession,
}));

jest.unstable_mockModule("../../../backend/gameSetup/player.js", () => ({
  default: mockPlayer,
}));

//we import launchServer AFTER setting up the mocks
//this ensures launchServer gets the mocked versions of its dependencies
const { launchServer, getAvailableGamesForListing, handleDisconnect } = await import("../../../backend/gameSetup/launchServer.js");

//describe groups related tests together
//this is testing the helper functions inside launchServer.js
describe("launchServer utility functions", () => {
  //beforeEach runs before every individual test
  //jest.clearAllMocks() resets all mock function call tracking
  //this ensures each test starts with a clean slate
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //this tests the function that finds games players can join
  describe("getAvailableGamesForListing", () => {
    test("returns empty array when no game sessions exist", () => {
      //create empty gameSessions object (no games exist)
      const gameSessions = {};
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect it to return empty array since no games exist
      expect(result).toEqual([]);
    });

    test("returns empty array when no games have exactly 1 player", () => {
      //create test data with games that have 0 players and 2 players using factories
      const emptySession = createGameSessionWithPlayers(TEST_PLAYERS.EMPTY_GAME);
      const fullSession = createGameSessionWithPlayers(TEST_PLAYERS.CHESS_FULL_GAME);
      
      const gameSessions = {
        [emptySession.gameSessionID]: emptySession,
        [fullSession.gameSessionID]: fullSession
      };
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect empty array since no games have exactly 1 player waiting
      expect(result).toEqual([]);
    });

    test("returns game info when a game has exactly 1 player", () => {
      //create test data with mixed game states using factories
      const emptySession = createGameSessionWithPlayers(TEST_PLAYERS.EMPTY_GAME);
      const waitingSession = createGameSessionWithPlayers(TEST_PLAYERS.CHESS_WAITING_GAME);
      const fullSession = createGameSessionWithPlayers(TEST_PLAYERS.CHESS_FULL_GAME);
      
      const gameSessions = {
        [emptySession.gameSessionID]: emptySession,
        [waitingSession.gameSessionID]: waitingSession,
        [fullSession.gameSessionID]: fullSession,
      };
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect it to return info about session2 (the only game with 1 player)
      expect(result).toEqual([{
        gameSessionID: waitingSession.gameSessionID,
        waitingPlayer: {
          username: "waitingplayer",
          colour: "black"
        },
        playersConnected: 1,
        maxPlayers: 2
      }]);
    });

    test("returns multiple games when multiple games have 1 player", () => {
      //create test data with two games that both have 1 player waiting using factories
      const waitingSession1 = createGameSessionWithPlayers([{username: "user1", socketId: "socket1", colour: "black"}]);
      const waitingSession2 = createGameSessionWithPlayers([{username: "user2", socketId: "socket2", colour: "black"}]);
      
      const gameSessions = {
        [waitingSession1.gameSessionID]: waitingSession1,
        [waitingSession2.gameSessionID]: waitingSession2,
      };
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect it to return both games since both have 1 player waiting
      expect(result).toHaveLength(2);
      //expect.arrayContaining checks that the array contains these items (order doesn't matter)
      expect(result).toEqual(expect.arrayContaining([
        {
          gameSessionID: waitingSession1.gameSessionID,
          waitingPlayer: {
            username: "user1",
            colour: "black"
          },
          playersConnected: 1,
          maxPlayers: 2
        },
        {
          gameSessionID: waitingSession2.gameSessionID,
          waitingPlayer: {
            username: "user2",
            colour: "black"
          },
          playersConnected: 1,
          maxPlayers: 2
        }
      ]));
    });
  });

  //this tests the event handling logic when clients connect to the server
  describe("connection event handling", () => {
    test("emits connected event when client connects", () => {
      //create fake server and fake client socket
      const mockIO = createMockIOServer();
      const mockSocket = createMockSocket();
      
      //set up fake user authentication data
      mockSocket.handshake.auth.username = "testuser";
      
      //call launchServer which sets up all the event handlers
      launchServer(mockIO);
      
      //launchServer should have called mockIO.on("connection", someFunction)
      //we need to find that function so we can test it
      //mockIO.on.mock.calls is an array of all the times mockIO.on was called
      //we find the call where the first argument was "connection"
      const connectionHandler = mockIO.on.mock.calls.find(call => call[0] === "connection")[1];
      
      //now simulate a client connecting by calling the connection handler
      connectionHandler(mockSocket);
      
      //verify that the server sent a welcome message to the client
      expect(mockSocket.emit).toHaveBeenCalledWith("connected", {
        username: "testuser",
        socketId: mockSocket.id,
        message: "Connected to chess server"
      });
    });

    test("handles getAvailableGames event with real function", () => {
      //create fake server and socket
      const mockIO = createMockIOServer();
      const mockSocket = createMockSocket();
      
      //call launchServer which sets up all the event handlers
      launchServer(mockIO);
      
      //get the connection handler and simulate connection
      const connectionHandler = mockIO.on.mock.calls.find(call => call[0] === "connection")[1];
      connectionHandler(mockSocket);
      
      //clear previous emits to focus on the getAvailableGames response
      mockSocket.emit.mockClear();
      
      //simulate the getAvailableGames event
      mockSocket.simulateIncoming("getAvailableGames");
      
      //verify the server responded with available games list (empty in this case)
      expect(mockSocket.emit).toHaveBeenCalledWith("availableGames", []);
    });
  });

  //this tests what happens when players disconnect from the server
  describe("handleDisconnect cleanup functionality", () => {
    test("removes player from connectedPlayers when socket disconnects", () => {
      //set up test data using factory with proper session structure
      const { sessionManager, session } = createTestScenario([
        { username: "player1", socketId: "socket1", colour: "black" }
      ]);
      
      const gameSessions = { [session.gameSessionID]: session };
      const socketIDtoGameSessionID = sessionManager.socketIDtoGameSessionID;
      const connectedPlayers = sessionManager.connectedPlayers;
      const mockSocket = createMockSocket("socket1");
      
      //call the actual exported function
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the player was removed from the connected players list
      expect(connectedPlayers["socket1"]).toBeUndefined();
    });

    test("cleans up empty game session when last player disconnects", () => {
      //set up test data using factory with proper session structure
      const { sessionManager, session } = createTestScenario([
        { username: "player1", socketId: "socket1", colour: "black" }
      ]);
      
      const gameSessions = { [session.gameSessionID]: session };
      const socketIDtoGameSessionID = sessionManager.socketIDtoGameSessionID;
      const connectedPlayers = sessionManager.connectedPlayers;
      const mockSocket = createMockSocket("socket1");
      
      //call the actual exported function
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the empty game session was deleted (memory cleanup)
      expect(gameSessions[session.gameSessionID]).toBeUndefined();
      //verify the socket-to-game mapping was removed
      expect(socketIDtoGameSessionID["socket1"]).toBeUndefined();
    });

    test("keeps game session when other players remain after disconnect", () => {
      //set up test data using factory with 2 players
      const { sessionManager, session } = createTestScenario([
        { username: "player1", socketId: "socket1", colour: "black" },
        { username: "player2", socketId: "socket2", colour: "white" }
      ]);
      
      const gameSessions = { [session.gameSessionID]: session };
      const socketIDtoGameSessionID = sessionManager.socketIDtoGameSessionID;
      const connectedPlayers = sessionManager.connectedPlayers;
      const mockSocket = createMockSocket("socket1"); //player1 disconnects
      
      //call the actual exported function
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the game session still exists (because player2 is still there)
      expect(gameSessions[session.gameSessionID]).toBeDefined();
      //verify only the disconnected player was removed from the game
      expect(gameSessions[session.gameSessionID].connectedPlayersSocketIDs.players["socket1"]).toBeUndefined();
      expect(gameSessions[session.gameSessionID].connectedPlayersSocketIDs.players["socket2"]).toBeDefined();
      //verify only the disconnected player's mapping was removed
      expect(socketIDtoGameSessionID["socket1"]).toBeUndefined();
      expect(socketIDtoGameSessionID["socket2"]).toBe(session.gameSessionID);
    });

    test("handles disconnect gracefully when session data is null", () => {
      //set up edge case test data where session mapping exists but session doesn't
      const gameSessions = {}; //no game sessions exist
      const socketIDtoGameSessionID = {"socket1": "nonexistent-session"}; //but mapping points to non-existent game
      const connectedPlayers = {"socket1": {username: "player1"}};
      const mockSocket = createMockSocket("socket1");
      
      //the function should handle this gracefully without crashing
      expect(() => {
        handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      }).not.toThrow();
      
      //verify the player was still removed from the global connected players list
      expect(connectedPlayers["socket1"]).toBeUndefined();
    });
  });
});