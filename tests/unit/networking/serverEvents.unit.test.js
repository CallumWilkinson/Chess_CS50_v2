import { jest } from "@jest/globals";
import { launchServer } from "../../../backend/gameSetup/launchServer.js";
import Pawn from "../../../chessCore/chessPieces/pawn.js";
import Position from "../../../chessCore/gameLogic/position.js";
import { createMockSocket, createMockIOServer } from "../../helpers/testUtils.js";

describe("Testing that the server is sending and receiving data over sockets as intended", () => {
  let mockSocketA;
  let mockSocketB;
  let mockIOServer;
  let rooms;
  let connectionHandler;
  let gameID;

  //this beforeEach block does pretty much everything that server.js does so it works like an entry point
  beforeEach(() => {
    //new room state for each test
    rooms = {};

    //each player gets their own socket
    mockSocketA = createMockSocket(undefined, rooms);
    mockSocketB = createMockSocket(undefined, rooms);

    //create mock io server using shared utility
    mockIOServer = createMockIOServer(rooms);
    
    //modify the mock to store connection handler for additional sockets
    const originalOn = mockIOServer.on;
    mockIOServer.on = jest.fn((event, callback) => {
      if (event === "connection") {
        connectionHandler = callback;
        //simulate each client connecting to the server
        callback(mockSocketA);
        callback(mockSocketB);
      }
      return originalOn(event, callback);
    });

    //this will call server.on and attaches all socket.on event listners on the server side
    //this function is the logic that i want to test
    launchServer(mockIOServer);
  });

  //ensures a clean spy state before each test, not sure if needed but may aswell
  afterEach(() => {
    jest.clearAllMocks();
    //clean up connection handler
    connectionHandler = undefined;
  });

  test("PlayerA chooses to make a new game session, asserting that the client sends createnewgame event to server and server sends back the initial board state", () => {
    //simulate the client sending a createnewgame event to the server
    //the server's response logic will trigger once this line runs
    mockSocketA.simulateIncoming("createNewChessGame");

    //expect that once the server receives this createnewgame event, it sends back the playerinfo and initial game state object to the client
    expect(mockSocketA.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      })
    );

    const hostRosterEmit = mockSocketA.emit.mock.calls.find(call => call[0] === "session:players");
    expect(hostRosterEmit).toBeDefined();
    expect(hostRosterEmit[1]).toEqual(
      expect.objectContaining({
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      })
    );
  });

  test("Player A chooses to join an existing game, asserting that the server sends back the correct game instance that they choose to join", () => {
    //clear previous emits
    mockSocketA.emit.mockClear();
    mockSocketB.emit.mockClear();

    //user A chooses to createNewGame
    mockSocketA.simulateIncoming("createNewChessGame");

    //get gameID from available games
    mockSocketB.simulateIncoming("getAvailableGames");
    const availableGamesCall = mockSocketB.emit.mock.calls.find(call => call[0] === "availableGames");
    expect(availableGamesCall).toBeDefined();
    expect(availableGamesCall[1]).toHaveLength(1);
    
    const gameID = availableGamesCall[1][0].gameSessionID;

    //user B chooses to join the game that user A created
    mockSocketB.simulateIncoming("joinExistingGame", gameID);

    expect(mockSocketB.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      })
    );

    const rosterBroadcast = mockIOServer.__toEmitMock.mock.calls.find(call => call[0] === "session:players");
    expect(rosterBroadcast).toBeDefined();
    expect(rosterBroadcast[1]).toEqual(
      expect.objectContaining({
        players: expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            colour: expect.any(String),
          }),
        ]),
      })
    );
  });

  test("When player A makes a move, I expect that both player A and player B will BOTH receive the updated game state", () => {
    //clear all previous emit calls
    mockSocketA.emit.mockClear();
    mockSocketB.emit.mockClear();
    mockIOServer.__toEmitMock.mockClear();

    //player A makes a new game
    mockSocketA.simulateIncoming("createNewChessGame");

    //extract gameID from the playerInfoAndInitialGameState emit
    const gameCreationCall = mockSocketA.emit.mock.calls.find(call => call[0] === "playerInfoAndInitialGameState");
    expect(gameCreationCall).toBeDefined();
    
    //clear emits again before player B joins
    mockSocketA.emit.mockClear();
    mockSocketB.emit.mockClear();

    //player B joins the game - get gameID from the available games or use a known pattern
    //since we can't access socketIDtoGameSessionID, we'll simulate joining the first available game
    mockSocketB.simulateIncoming("getAvailableGames");
    const availableGamesCall = mockSocketB.emit.mock.calls.find(call => call[0] === "availableGames");
    expect(availableGamesCall).toBeDefined();
    expect(availableGamesCall[1]).toHaveLength(1); //should have 1 available game
    
    const availableGameID = availableGamesCall[1][0].gameSessionID;
    gameID = availableGameID;

    //player B joins it
    mockSocketB.simulateIncoming("joinExistingGame", gameID);

    //clear emits before move
    mockSocketA.emit.mockClear();
    mockSocketB.emit.mockClear();
    mockIOServer.__toEmitMock.mockClear();

    //playerA moves black pawn at a7 to a6 (playerA is black and goes first)
    const a7 = new Position("a7");
    const blackPawn = new Pawn("black", a7);
    const a6 = new Position("a6");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: a6,
    };
    mockSocketA.simulateIncoming("move", moveData);

    //this tests the actual server logic that it was emited to everyone including the sender
    expect(mockIOServer.__toEmitMock).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );

    //assert that playerA RECEIVED THE NEW GAME STATE
    //this tests that the client received the event
    expect(mockSocketA.emit).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );

    //assert that playerB RECEIVED THE NEW GAME STATE
    //this tests that the client received the event
    expect(mockSocketB.emit).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );
  });

  test("server prevents more than two players from joining the same session", () => {
    //clear all emits
    mockSocketA.emit.mockClear();
    mockSocketB.emit.mockClear();

    //player A creates a new game
    mockSocketA.simulateIncoming("createNewChessGame");

    //get gameID from available games
    mockSocketB.simulateIncoming("getAvailableGames");
    const availableGamesCall = mockSocketB.emit.mock.calls.find(call => call[0] === "availableGames");
    expect(availableGamesCall).toBeDefined();
    expect(availableGamesCall[1]).toHaveLength(1);
    
    const gameID = availableGamesCall[1][0].gameSessionID;

    //player B joins the game (should work fine)
    mockSocketB.simulateIncoming("joinExistingGame", gameID);

    //create a third socket for the third player
    const mockSocketC = createMockSocket(undefined, rooms);
    //set the username to match the test expectation
    mockSocketC.handshake.auth.username = "testuser";
    //register it with the server
    connectionHandler(mockSocketC);

    //clear previous emits so we only see the join attempt response
    mockSocketC.emit.mockClear();

    //third player tries to join the same game (should be rejected)
    mockSocketC.simulateIncoming("joinExistingGame", gameID);

    //verify the server sent back an error message
    expect(mockSocketC.emit).toHaveBeenCalledWith(
      "error",
      "Game session is full"
    );
  });

  test("when a client connects, they dont automatically join a game", () => {
    //in the beforeEach, both socketA and socketB are already connected
    //the new flow should only send a welcome message, not automatically pair

    //verify player A got connected message (not game state)
    expect(mockSocketA.emit).toHaveBeenCalledWith(
      "connected",
      expect.objectContaining({
        username: "testuser",
        socketId: mockSocketA.id,
        message: "Connected to chess server",
      })
    );

    //verify player B got connected message (not game state)
    expect(mockSocketB.emit).toHaveBeenCalledWith(
      "connected",
      expect.objectContaining({
        username: "testuser",
        socketId: mockSocketB.id,
        message: "Connected to chess server",
      })
    );

    //verify that no games are available since neither player created one
    mockSocketA.simulateIncoming("getAvailableGames");
    const availableGamesCall = mockSocketA.emit.mock.calls.find(call => call[0] === "availableGames");
    expect(availableGamesCall[1]).toEqual([]); //should be empty array
  });

  test("getAvailableGames event returns list of available games", () => {
    //clear previous emits
    mockSocketA.emit.mockClear();
    
    //player A creates a new game
    mockSocketA.simulateIncoming("createNewChessGame");

    //create a third socket
    const mockSocketC = createMockSocket(undefined, rooms);
    mockSocketC.handshake.auth.username = "testuser";
    connectionHandler(mockSocketC);

    //clear previous emits to focus on the getAvailableGames response
    mockSocketC.emit.mockClear();

    //third player requests available games
    mockSocketC.simulateIncoming("getAvailableGames");

    //verify server responded with available games list
    expect(mockSocketC.emit).toHaveBeenCalledWith(
      "availableGames",
      expect.arrayContaining([
        expect.objectContaining({
          gameSessionID: expect.any(String),
          waitingPlayer: expect.objectContaining({
            username: "testuser",
            colour: expect.any(String),
          }),
          playersConnected: 1,
          maxPlayers: 2,
        }),
      ])
    );
  });

  test("getAvailableGames returns empty array when no games available", () => {
    //create a third socket without any games created
    const mockSocketC = createMockSocket(undefined, rooms);
    mockSocketC.handshake.auth.username = "testuser";
    connectionHandler(mockSocketC);

    //clear previous emits to focus on the getAvailableGames response
    mockSocketC.emit.mockClear();

    //third player requests available games
    mockSocketC.simulateIncoming("getAvailableGames");

    //verify server responded with empty array
    expect(mockSocketC.emit).toHaveBeenCalledWith("availableGames", []);
  });
});

