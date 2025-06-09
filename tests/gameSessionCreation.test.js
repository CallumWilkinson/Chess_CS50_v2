import { expect, jest } from "@jest/globals";
import { launchServer } from "../backend/gameSetup/launchServer.js";

//this method returns an object with functions on it
//the mock socket can simulate what happens when the server recieves an event from the client
function createMockSocket() {
  //store callbacks like createNewGame ect
  //key is eventName
  const handlers = {};

  return {
    //random id for the socket, this simulates socket.id
    id: Math.random().toString(36).slice(2, 8),

    //mock function for socket.join
    join: jest.fn(),

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

  //this beforeEach block does pretty much everything that server.js does so it works like an entry point
  beforeEach(() => {
    //run the createmocksocket function above
    mockSocket = createMockSocket();

    //create a server that has an on(event, callback) method it can call on itself
    mockServer = {
      on(event, callback) {
        if (event === "connection") {
          callback(mockSocket);
        }
      },
    };

    //this will call server.on and attaches all socket.on event listners on the server side
    //this function is the logic that i want to test
    socketIDtoGameID = launchServer(mockServer);
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

    //does each player have their own mockSocket?
    let mockSocketTwo = createMockSocket();

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
