import { jest } from "@jest/globals";

//creates a fake game session object for testing
//the 'players' parameter lets us control how many players are in the session
export function createMockGameSession(players) {
  return {
    gameSessionID: "test-session-id",
    connectedPlayersSocketIDs: {
      players: players || {}, //if no players passed, use empty object
    },
    gameInstance: {
      board: {},
      gameStateManager: {},
    },
  };
}

//creates a fake socket that behaves like a real websocket connection
//in real life, socket.io creates these when clients connect
//we make fake ones for testing so we don't need real client connections
export function createMockSocket(id, rooms = {}) {
  //store callbacks for event handlers
  const handlers = {};
  
  const socket = {
    id: id || Math.random().toString(36).slice(2, 8), //unique identifier for this fake socket
    emit: jest.fn(), //jest.fn() tracks when/how this function is called
    join: jest.fn((room) => {
      //simulate joining a room
      socket.joinedRooms = socket.joinedRooms || [];
      socket.joinedRooms.push(room);
      
      //add to rooms object if provided
      if (rooms) {
        if (!rooms[room]) {
          rooms[room] = new Set();
        }
        rooms[room].add(socket);
      }
    }),
    on: jest.fn((eventName, callback) => {
      //store event handler for later simulation
      handlers[eventName] = callback;
    }),
    handshake: {
      auth: {
        username: "testuser", //simulates authenticated user data
      },
    },
    joinedRooms: [],
    
    //allows tests to simulate incoming events
    simulateIncoming(eventName, ...args) {
      if (handlers[eventName]) {
        handlers[eventName](...args);
      }
    },
    
    //allows socket.to(room).emit() calls
    to(room) {
      const sender = this;
      return {
        emit(eventName, ...args) {
          if (rooms && rooms[room]) {
            for (const sock of rooms[room]) {
              if (sock !== sender) {
                sock.emit(eventName, ...args);
              }
            }
          }
        },
      };
    },
  };
  
  return socket;
}

//creates a fake socket.io server that behaves like the real one
//the real server manages all client connections and broadcasts messages
//we make a fake one for testing so we don't need a real server running
export function createMockIOServer(rooms = {}) {
  const toEmitMock = jest.fn();
  
  return {
    on: jest.fn(), //tracks when server registers event listeners (like 'connection')
    emit: jest.fn(), //tracks when server broadcasts to all clients
    to: jest.fn((room) => ({
      emit: jest.fn((eventName, ...args) => {
        //simulate broadcasting to all sockets in room
        if (rooms && rooms[room]) {
          for (const sock of rooms[room]) {
            sock.emit(eventName, ...args);
          }
        }
        toEmitMock(eventName, ...args);
      }),
    })),
    __toEmitMock: toEmitMock, //expose for testing
  };
}

//creates mock data for testing with specified number of players
export function createMockGameSessions(config = {}) {
  const sessions = {};
  
  //create session with 0 players
  if (config.emptySession) {
    sessions["empty-session"] = createMockGameSession({});
  }
  
  //create session with 1 player
  if (config.onePlayerSession) {
    sessions["one-player-session"] = createMockGameSession({
      "player1": { username: "user1", colour: "black" }
    });
  }
  
  //create session with 2 players
  if (config.twoPlayerSession) {
    sessions["two-player-session"] = createMockGameSession({
      "player1": { username: "user1", colour: "black" },
      "player2": { username: "user2", colour: "white" }
    });
  }
  
  return sessions;
}