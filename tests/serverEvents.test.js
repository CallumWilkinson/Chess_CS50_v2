import { expect, jest } from "@jest/globals";
import { launchServer } from "../backend/gameSetup/launchServer.js";
import Pawn from "../backend/chessPieces/pawn.js";
import Position from "../backend/gameLogic/position.js";

//this method returns an object with functions on it
//the mock socket can simulate what happens when the server recieves an event from the client
function createMockSocket() {
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

      //the rooms[] is shared across all sockets, wheras joinedRooms[] is per socket
      //rooms[] tracks who is in what room
      const rooms = [];

      //check if the room exists already
      const roomExists = rooms[room] !== undefined;

      //if it doesnt, make a new set
      //a set() automatically prevents duplicates, so if the same socket tried to join the same room twice, it wont be duplicated
      //its also faster than searching an array
      if (!roomExists) {
        rooms[room] = new Set();

        //adds this mock socket to the room's set we made above
        //this way, each room is store a list of sockets
        //so when i call socket.to(room1).emit(...) i can send events to all other sockets in that room
        rooms[room].add(this);
      }
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
    //this allows me to send to EVERY SOCKET IN THE ROOM EXCEPT THE SENDER
    to(room) {
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
              if (sock !== this) {
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
  let mockSocket;
  let mockServer;
  let socketIDtoGameID;
  //stores a callback FUNCTION inside a variable
  let connectionCallBack;

  //this beforeEach block does pretty much everything that server.js does so it works like an entry point
  beforeEach(() => {
    //run the createmocksocket function above
    mockSocket = createMockSocket();

    //create a server that has an on(event, callback) method it can call on itself
    mockServer = {
      on(event, callback) {
        if (event === "connection") {
          connectionCallBack = callback;
          callback(mockSocket);
        }
      },
    };

    //this will call server.on and attaches all socket.on event listners on the server side
    //this function is the logic that i want to test
    socketIDtoGameID = launchServer(mockServer);
  });

  test("moves are broadcast to all players in the same lobby", () => {
    //each player gets their own socket
    const socketA = createMockSocket();
    const socketB = createMockSocket();

    //both players connect to the server
    const multiServer = {
      on(event, callback) {
        if (event === "connection") {
          callback(socketA);
          //isnt this the same as using the connectionCallBack variable?
          callback(socketB);
        }
      },
    };

    //if this mapping has both socket.ids then they have both joined
    const socketIDtoGameID = launchServer(multiServer);

    //player A makes a new game
    socketA.simulateIncoming("createNewGame");

    //get game id from playerA socket id
    const gameID = socketIDtoGameID[socketA.id];

    //player B joins it
    socketB.simulateIncoming("joinExistingGame", gameID);

    //playerA moves pawn at a7 to a6
    let a7 = new Position("a7");
    let blackPawn = new Pawn("black", a7);
    let a6 = new Position("a6");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: a6,
    };
    socketA.simulateIncoming("move", moveData);

    //expecting player A to be in the game lobby
    expect(socketIDtoGameID[socketA.id]).toBe(gameID);

    //expecting player B to be in the game lobby
    expect(socketIDtoGameID[socketB.id]).toBe(gameID);

    //assert that playerA RECEIVED THE NEW GAME STATE
    expect(socketA.emit).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );

    //assert that playerB RECEIVED THE NEW GAME STATE
    expect(socketB.emit).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );
  });

  test("Client chooses to make a new game session, sends createnewgame event to server and server sends back the initial board state", () => {
    //simulate the client sending a createnewgame event to the server
    //the server's response logic will trigger once this line runs
    mockSocket.simulateIncoming("createNewGame");

    //expect that once the server receives this createnewgame event, it sends back the playerinfo and initial game state object to the client
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
      })
    );
  });

  test("client chooses to join an existing game, server sends back the game instance they choose to join", () => {
    //user A chooses to createNewGame
    mockSocket.simulateIncoming("createNewGame");

    //lookup game id using the socket.id connection that made the game above
    const gameID = socketIDtoGameID[mockSocket.id];

    //second player connects to server
    let mockSocketTwo = createMockSocket();

    //use the connection callback variable (which is actually a function stored inside the variable)
    //this is what connects the second player to the existing socket?
    //we connect another mock socket by using the connection callback we stored earlier
    connectionCallBack(mockSocketTwo);

    //user B chooses to join the game that user A created
    mockSocketTwo.simulateIncoming("joinExistingGame", gameID);

    expect(mockSocketTwo.emit).toHaveBeenCalledWith(
      "playerInfoAndInitialGameState",
      expect.objectContaining({
        colour: expect.any(String),
        gameInstance: expect.any(Object),
      })
    );
  });
});
