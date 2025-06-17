import { expect, jest } from "@jest/globals";
import { launchServer } from "../backend/gameSetup/launchServer.js";
import Pawn from "../backend/chessPieces/pawn.js";
import Position from "../backend/gameLogic/position.js";

//this method returns an object with functions on it
//the mock socket can simulate what happens when the server recieves an event from the client
function createMockSocket(rooms) {
  //store callbacks like createNewGame ect
  //key is eventName
  const handlers = {};

  return {
    //random id for the socket, this simulates socket.id
    id: Math.random().toString(36).slice(2, 8),

    //tracks which rooms the mocksocket has joined, accessed as socket.joinedRooms[]
    //tracks what room THIS SOCKET joined
    joinedRooms: [],

    //mock function for socket.join
    //simulates socket.join(room) where room is a string
    //the jest.fn() wrapper allows you to track how many times join is called and what arguments it was called with
    join: jest.fn(function (room) {
      //add room (string) to array
      this.joinedRooms.push(room);

      //check if the room exists already
      //the rooms[] is shared across all sockets, wheras joinedRooms[] is per socket, rooms object is defined OUTISDE OF THIS FUNCTION
      //rooms[] tracks who is in what room
      const roomExists = rooms[room] !== undefined;

      //if it doesnt, make a new set
      //a set() automatically prevents duplicates, so if the same socket tried to join the same room twice, it wont be duplicated
      //its also faster than searching an array
      if (!roomExists) {
        rooms[room] = new Set();
      }
      //adds this mock socket to the room's set we made above
      //this way, each room is store a list of sockets
      //so when i call socket.to(room1).emit(...) i can send events to all other sockets in that room
      rooms[room].add(this);
    }),

    //add auth value to the socket to simulate auth
    handshake: {
      auth: {
        //setting to undefined simulates every user just going in as guest
        username: undefined,
      },
    },

    //register event listeners
    //simulates socket.on for ANY event, store callback so we can trigger it later
    //you call this by writing socket.on, as this function returns an object (which you call a socket) and this function can be run on the object
    //this should simulate what we have on the backend at the moment (socket.on(creategame))
    on(eventName, callback) {
      handlers[eventName] = callback;
    },

    //create a fake socket.emit to track server responses
    //this is a mock function
    //replaces the real socket.emit with a jest spy so we can test what the server emmitted in response
    emit: jest.fn(),

    //allows me to call .to(room) on the socket
    //this allows me to mock sending an event to EVERY SOCKET IN THE ROOM EXCEPT THE SENDER
    to(room) {
      //we need this variable so we can referece the current object in the code below ("this" inside the "emit" function is different to "this" inside the "to" function)
      const sender = this;

      //returns a new object with an emit() function so i can call
      //socket.to("room123").emit("someEvent", payload);
      return {
        emit(eventName, ...args) {
          //check if room exists in the rooms object
          if (rooms[room]) {
            //loop through all sockets that have joined this room
            //rooms[room] is a set of sockets Set { socketA, socketB, socketC }
            for (const sock of rooms[room]) {
              //skip the sender, we only want to send to other sockets
              if (sock !== sender) {
                //simulate emiting the event to the socket currently iterated
                sock.emit(eventName, ...args);
              }
            }
          }
        },
      };
    },

    //syntax ...args means any number of arguments, called a rest parameter
    //example call would be simulateIncoming("movePiece", { from: "e2", to: "e4" });
    simulateIncoming(eventName, ...args) {
      //below is true when you previously have called socket.on(eventname)
      if (handlers[eventName]) {
        //run the call back function with the given args
        handlers[eventName](...args);
      }
    },
  };
}

describe("Testing that the server is sending and receiving data over sockets as intended", () => {
  let mockSocketA;
  let mockSocketB;
  let mockIOServer;
  let socketIDtoGameID;
  let rooms;

  //this beforeEach block does pretty much everything that server.js does so it works like an entry point
  beforeEach(() => {
    //new room state for each test
    rooms = {};

    //each player gets their own socket
    mockSocketA = createMockSocket(rooms);
    mockSocketB = createMockSocket(rooms);

    //so we can assert against the same function used in handleMove.js
    const toEmitMock = jest.fn();

    //both players connect to the server
    //this is to mock the io server
    //this simulates the server, WHICH IS DIFFERENT TO THE SOCKET sending socket events is different to sending server events
    mockIOServer = {
      //mock the .on() method
      on(event, callback) {
        if (event === "connection") {
          //simulate each client connecting to the server
          callback(mockSocketA);
          callback(mockSocketB);
        }
      },
      //mock the emit method to spy on how it is called
      emit: jest.fn(),
      //mock the to(room) method to mock how handlemove.js broadcasts events to ALL clients in a roon
      to: jest.fn((room) => ({
        //mock the emit() method that would be chained after io.to()
        emit: (eventName, ...args) => {
          //check room exists first
          if (rooms[room]) {
            //loop over all sockets in the room
            for (const sock of rooms[room]) {
              //simulate sending events to each socket in the room (including sender)
              sock.emit(eventName, ...args);
            }
          }
          //call a test spy function to track this emit
          //this is needed so we can call our assertions/expects later on in our tests
          toEmitMock(eventName, ...args);
        },
      })),
      //expose the spy so we can assert io.to().emit() was called
      __toEmitMock: toEmitMock,
    };

    //this will call server.on and attaches all socket.on event listners on the server side
    //this function is the logic that i want to test
    socketIDtoGameID = launchServer(mockIOServer);
  });

  //ensures a clean spy state before each test, not sure if needed but may aswell
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("PlayerA chooses to make a new game session, asserting that the client sends createnewgame event to server and server sends back the initial board state", () => {
    //simulate the client sending a createnewgame event to the server
    //the server's response logic will trigger once this line runs
    mockSocketA.simulateIncoming("createNewGame");

    //expect that once the server receives this createnewgame event, it sends back the playerinfo and initial game state object to the client
    expect(mockSocketA.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
      })
    );
  });

  test("Player A chooses to join an existing game, asserting that the server sends back the correct game instance that they choose to join", () => {
    //user A chooses to createNewGame
    mockSocketA.simulateIncoming("createNewGame");

    //lookup game id using the socket.id connection that made the game above
    const gameID = socketIDtoGameID[mockSocketA.id];

    //user B chooses to join the game that user A created
    mockSocketB.simulateIncoming("joinExistingGame", gameID);

    expect(mockSocketB.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
      })
    );
  });

  test("When player A makes a move, I expect that both player A and player B will BOTH receive the updated game state", () => {
    //player A makes a new game
    mockSocketA.simulateIncoming("createNewGame");

    //get game id from playerA socket id
    const gameID = socketIDtoGameID[mockSocketA.id];

    //player B joins it
    mockSocketB.simulateIncoming("joinExistingGame", gameID);

    //playerA moves pawn at a7 to a6
    let a7 = new Position("a7");
    let blackPawn = new Pawn("black", a7);
    let a6 = new Position("a6");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: a6,
    };
    mockSocketA.simulateIncoming("move", moveData);

    //expecting player A to be in the game lobby
    expect(socketIDtoGameID[mockSocketA.id]).toBe(gameID);

    //expecting player B to be in the game lobby
    expect(socketIDtoGameID[mockSocketB.id]).toBe(gameID);

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
});
