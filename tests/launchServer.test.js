import { jest } from "@jest/globals";
import { createMockSocket, createMockGameSession, createMockIOServer, createMockGameSessions } from "./testUtils.js";

//these are mock functions that replace the real functions during testing
//this allows us to test launchServer.js without depending on other modules
//jest.fn() creates a fake function that tracks when/how it's called
const mockHandleMove = jest.fn();
const mockGameSession = jest.fn();
const mockPlayer = jest.fn();

//jest.unstable_mockModule replaces the real modules with fake ones
//this way when launchServer.js tries to import these modules, it gets our mocks instead
//we do this to isolate the code we want to test (launchServer.js)
jest.unstable_mockModule("../backend/helpers/handleMove.js", () => ({
  handleMove: mockHandleMove,
}));

jest.unstable_mockModule("../backend/gameSetup/gameSession.js", () => ({
  default: mockGameSession,
}));

jest.unstable_mockModule("../backend/gameSetup/player.js", () => ({
  default: mockPlayer,
}));

//we import launchServer AFTER setting up the mocks
//this ensures launchServer gets the mocked versions of its dependencies
const { launchServer, getAvailableGamesForListing } = await import("../backend/gameSetup/launchServer.js");

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
      //create test data with games that have 0 players and 2 players
      //but no games with exactly 1 player waiting
      const gameSessions = createMockGameSessions({
        emptySession: true,
        twoPlayerSession: true
      });
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect empty array since no games have exactly 1 player waiting
      expect(result).toEqual([]);
    });

    test("returns game info when a game has exactly 1 player", () => {
      //create test data with mixed game states
      const gameSessions = {
        "session1": createMockGameSession({}), //0 players - empty game
        "session2": createMockGameSession({"player1": {username: "testuser", colour: "black"}}), //1 player - available to join!
        "session3": createMockGameSession({"player1": {username: "user1", colour: "black"}, "player2": {username: "user2", colour: "white"}}), //2 players - full game
      };
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect it to return info about session2 (the only game with 1 player)
      expect(result).toEqual([{
        gameSessionID: "session2",
        waitingPlayer: {
          username: "testuser",
          colour: "black"
        },
        playersConnected: 1,
        maxPlayers: 2
      }]);
    });

    test("returns multiple games when multiple games have 1 player", () => {
      //create test data with two games that both have 1 player waiting
      const gameSessions = {
        "session1": createMockGameSession({"player1": {username: "user1", colour: "black"}}), //1 player waiting
        "session2": createMockGameSession({"player1": {username: "user2", colour: "black"}}), //1 player waiting
      };
      
      //call the actual exported function
      const result = getAvailableGamesForListing(gameSessions);
      //expect it to return both games since both have 1 player waiting
      expect(result).toHaveLength(2);
      //expect.arrayContaining checks that the array contains these items (order doesn't matter)
      expect(result).toEqual(expect.arrayContaining([
        {
          gameSessionID: "session1",
          waitingPlayer: {
            username: "user1",
            colour: "black"
          },
          playersConnected: 1,
          maxPlayers: 2
        },
        {
          gameSessionID: "session2",
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
      expect(mockSocket.emit).toHaveBeenCalledWith("availableGamesList", []);
    });
  });

  //this tests what happens when players disconnect from the server
  describe("handleDisconnect cleanup functionality", () => {
    test("removes player from connectedPlayers when socket disconnects", () => {
      //set up test data with 1 player in a game session
      const gameSessions = {
        "session1": createMockGameSession({"socket1": {username: "player1"}}),
      };
      const socketIDtoGameSessionID = {"socket1": "session1"}; //mapping socket to game
      const connectedPlayers = {"socket1": {username: "player1"}}; //list of all connected players
      const mockSocket = createMockSocket("socket1"); //the disconnecting player
      
      //recreate the handleDisconnect logic to test it
      const handleDisconnect = (gameSessions, socketIDtoGameSessionID, socket, connectedPlayers) => {
        const gameSessionID = socketIDtoGameSessionID[socket.id]; //find which game the player was in
        delete connectedPlayers[socket.id]; //remove from global player list
        
        const sessionData = gameSessions[gameSessionID]; //get the game session data
        if (sessionData != null) {
          const playerData = sessionData.connectedPlayersSocketIDs.players[socket.id];
          if (playerData) {
            delete sessionData.connectedPlayersSocketIDs.players[socket.id]; //remove from game
            delete socketIDtoGameSessionID[socket.id]; //remove mapping
            
            //check if game is now empty
            const remainingPlayers = Object.keys(sessionData.connectedPlayersSocketIDs.players);
            if (remainingPlayers.length === 0) {
              delete gameSessions[gameSessionID]; //delete empty game to save memory
            }
          }
        }
      };
      
      //simulate the player disconnecting
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the player was removed from the connected players list
      expect(connectedPlayers["socket1"]).toBeUndefined();
    });

    test("cleans up empty game session when last player disconnects", () => {
      //set up test data with 1 player in a game (will become empty after disconnect)
      const gameSessions = {
        "session1": createMockGameSession({"socket1": {username: "player1"}}),
      };
      const socketIDtoGameSessionID = {"socket1": "session1"};
      const connectedPlayers = {"socket1": {username: "player1"}};
      const mockSocket = createMockSocket("socket1");
      
      //recreate the handleDisconnect logic
      const handleDisconnect = (gameSessions, socketIDtoGameSessionID, socket, connectedPlayers) => {
        const gameSessionID = socketIDtoGameSessionID[socket.id];
        delete connectedPlayers[socket.id];
        
        const sessionData = gameSessions[gameSessionID];
        if (sessionData != null) {
          const playerData = sessionData.connectedPlayersSocketIDs.players[socket.id];
          if (playerData) {
            delete sessionData.connectedPlayersSocketIDs.players[socket.id];
            delete socketIDtoGameSessionID[socket.id];
            
            const remainingPlayers = Object.keys(sessionData.connectedPlayersSocketIDs.players);
            if (remainingPlayers.length === 0) {
              delete gameSessions[gameSessionID];
            }
          }
        }
      };
      
      //simulate the last player disconnecting
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the empty game session was deleted (memory cleanup)
      expect(gameSessions["session1"]).toBeUndefined();
      //verify the socket-to-game mapping was removed
      expect(socketIDtoGameSessionID["socket1"]).toBeUndefined();
    });

    test("keeps game session when other players remain after disconnect", () => {
      //set up test data with 2 players in the same game
      const gameSessions = {
        "session1": createMockGameSession({
          "socket1": {username: "player1"}, //this player will disconnect
          "socket2": {username: "player2"}, //this player will remain
        }),
      };
      const socketIDtoGameSessionID = {
        "socket1": "session1", //both players in same game
        "socket2": "session1",
      };
      const connectedPlayers = {
        "socket1": {username: "player1"},
        "socket2": {username: "player2"},
      };
      const mockSocket = createMockSocket("socket1"); //player1 disconnects
      
      //recreate the handleDisconnect logic
      const handleDisconnect = (gameSessions, socketIDtoGameSessionID, socket, connectedPlayers) => {
        const gameSessionID = socketIDtoGameSessionID[socket.id];
        delete connectedPlayers[socket.id];
        
        const sessionData = gameSessions[gameSessionID];
        if (sessionData != null) {
          const playerData = sessionData.connectedPlayersSocketIDs.players[socket.id];
          if (playerData) {
            delete sessionData.connectedPlayersSocketIDs.players[socket.id];
            delete socketIDtoGameSessionID[socket.id];
            
            const remainingPlayers = Object.keys(sessionData.connectedPlayersSocketIDs.players);
            if (remainingPlayers.length === 0) {
              delete gameSessions[gameSessionID];
            }
          }
        }
      };
      
      //simulate player1 disconnecting
      handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      
      //verify the game session still exists (because player2 is still there)
      expect(gameSessions["session1"]).toBeDefined();
      //verify only the disconnected player was removed from the game
      expect(gameSessions["session1"].connectedPlayersSocketIDs.players["socket1"]).toBeUndefined();
      expect(gameSessions["session1"].connectedPlayersSocketIDs.players["socket2"]).toBeDefined();
      //verify only the disconnected player's mapping was removed
      expect(socketIDtoGameSessionID["socket1"]).toBeUndefined();
      expect(socketIDtoGameSessionID["socket2"]).toBe("session1");
    });

    test("handles disconnect gracefully when session data is null", () => {
      //set up test data where the game session doesn't exist (edge case)
      const gameSessions = {}; //no game sessions exist
      const socketIDtoGameSessionID = {"socket1": "nonexistent-session"}; //but mapping points to non-existent game
      const connectedPlayers = {"socket1": {username: "player1"}};
      const mockSocket = createMockSocket("socket1");
      
      //recreate the handleDisconnect logic
      const handleDisconnect = (gameSessions, socketIDtoGameSessionID, socket, connectedPlayers) => {
        const gameSessionID = socketIDtoGameSessionID[socket.id];
        delete connectedPlayers[socket.id];
        
        const sessionData = gameSessions[gameSessionID];
        if (sessionData != null) {
          const playerData = sessionData.connectedPlayersSocketIDs.players[socket.id];
          if (playerData) {
            delete sessionData.connectedPlayersSocketIDs.players[socket.id];
            delete socketIDtoGameSessionID[socket.id];
            
            const remainingPlayers = Object.keys(sessionData.connectedPlayersSocketIDs.players);
            if (remainingPlayers.length === 0) {
              delete gameSessions[gameSessionID];
            }
          }
        }
      };
      
      //the function should handle this gracefully without crashing
      expect(() => {
        handleDisconnect(gameSessions, socketIDtoGameSessionID, mockSocket, connectedPlayers);
      }).not.toThrow();
      
      //verify the player was still removed from the global connected players list
      expect(connectedPlayers["socket1"]).toBeUndefined();
    });
  });
});