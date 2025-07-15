**🚧 Active Development**: server-side-refactor branch

**📦 Repository**: https://github.com/CallumWilkinson/Chess_CS50_v2/tree/server-side-refactor

---

## Architecture Overview

**Core Philosophy**: Server-authoritative chess game with real-time multiplayer communication

- **Server**: Full chess validation, game state management, and session control
- **Client**: UI rendering and input handling
- **Communication**: [Socket.IO](http://Socket.IO) with room-based broadcasting

---

## Core Architecture Layers

### **1. HTTP Layer**

- **Express.js** serves static files and web requests
- Basic web server functionality

### **2. WebSocket Layer**

- [**Socket.IO**](http://Socket.IO) handles real-time bidirectional communication
- Room-based broadcasting for game sessions
- Event-driven architecture

### **3. Game Logic Layer**

- Custom chess engine with move validation
- Chess rules enforcement (legal moves, check, checkmate)
- Turn management and game state tracking

### **4. Session Management**

- In-memory game session tracking
- Automatic cleanup of empty sessions
- Player connection management

---

## Core Data Structures

### **Server State Management**

```
// Three primary data structures
gameSessions = {
  "gameID123": GameSession {
    gameInstance: GameInstance,
    players: [Player, Player],
    gameSessionID: "gameID123",
    socketRoom: "gameID123"
  }
}

connectedPlayers = {
  "socketID456": Player {
    username: "PlayerName",
    socketID: "socketID456",
    playerColor: "black"|"white"
  }
}

socketIDtoGameSessionID = {
  "socketID456": "gameID123"
}
```

### **Class Architecture**

- **GameSession**: Contains game instance and player management
- **GameInstance**: Chess board state, piece positions, turn tracking
- **Player**: User data and socket connection info

---

## [Socket.IO](http://Socket.IO) Communication Flow

### **1. Connection Process**

```
Client connects
    ↓ [socket.io](http://socket.io) connection
Server
    ↓ assigns username
    ↓ creates Player object
    ↓ adds to connectedPlayers map
    ↓ emit welcome message
Client receives connection confirmation
```

### **2. Game Discovery**

```
Client requests game list
    ↓ emit("getAvailableGames")
Server
    ↓ filters games with 1 player waiting
    ↓ emit("availableGames", gamesArray)
Client receives available games
```

### **3. Game Creation**

```
Client creates new game
    ↓ emit("createNewChessGame")
Server
    ↓ creates new GameSession
    ↓ creates new GameInstance
    ↓ assigns player color (black)
    ↓ socket.join(gameSessionID)
    ↓ maps socketID → gameSessionID
    ↓ emit("playerInfoAndInitialGameState", gameData)
Client receives game setup
```

### **4. Game Joining**

```
Client joins existing game
    ↓ emit("joinExistingGame", gameID)
Server
    ↓ validates game exists and has space
    ↓ assigns player color (white)
    ↓ socket.join(gameSessionID)
    ↓ maps socketID → gameSessionID
    ↓ emit("playerInfoAndInitialGameState", gameData)
    ↓ updates both players with full game state
Both clients receive updated game info
```

### **5. Gameplay Loop (Server Authority)**

```
Client attempts move
    ↓ emit("move", {chessPiece, targetPosition})
Server Validation
    ↓ validates turn order (correct player)
    ↓ validates chess rules (legal move)
    ↓ updates server game state
    ↓ calculates new board state
    ↓ [io.to](http://io.to)(gameSessionID).emit("newGameState", boardState)
Both clients receive synchronized board update

// Invalid move handling:
Server rejects invalid move
    ↓ emit("notYourTurn") or emit("error", details)
Client receives rejection feedback
```

### **6. Disconnection Cleanup**

```
Client disconnects
    ↓ socket.disconnect event
Server Cleanup
    ↓ removes player from session
    ↓ deletes from connectedPlayers
    ↓ removes socketID mapping
    ↓ cleans up empty game sessions
    ↓ notifies remaining players
Memory cleanup prevents leaks
```

---

## [Socket.IO](http://Socket.IO) Events Reference

### **Client → Server Events**

| Event                | Payload                        | Purpose                |
| -------------------- | ------------------------------ | ---------------------- |
| `connection`         | `{username}`                   | Initial connection     |
| `getAvailableGames`  | `{}`                           | Request game list      |
| `createNewChessGame` | `{}`                           | Start new game session |
| `joinExistingGame`   | `{gameID}`                     | Join existing session  |
| `move`               | `{chessPiece, targetPosition}` | Attempt chess move     |
| `disconnect`         | `{}`                           | Player disconnection   |

### **Server → Client Events**

| Event                           | Payload                 | Purpose                  |
| ------------------------------- | ----------------------- | ------------------------ |
| `welcome`                       | `{message}`             | Connection confirmation  |
| `availableGames`            | `{games[]}`             | List of joinable games   |
| `playerInfoAndInitialGameState` | `{color, gameInstance}` | Game setup data          |
| `newGameState`                  | `{gameInstance}`        | Updated board after move |
| `notYourTurn`                   | `{message}`             | Invalid turn attempt     |
| `error`                         | `{errorMessage}`        | Move validation failure  |
| `playerDisconnected`            | `{message}`             | Opponent left game       |

---

## Server Authority & Validation

### **Turn Validation**

```
// Server enforces turn order
if (currentPlayer.socketID !== gameInstance.currentTurn) {
  socket.emit('notYourTurn', 'Wait for your turn');
  return;
}
```

### **Chess Rules Validation**

```
// Server validates legal moves
if (!gameInstance.isValidMove(chessPiece, targetPosition)) {
  socket.emit('error', 'Invalid chess move');
  return;
}
```

### **Game State Management**

```
// Server maintains authoritative state
gameInstance.updateBoard(chessPiece, targetPosition);
gameInstance.switchTurn();
const newGameState = gameInstance.getGameState();

// Broadcast to room
[io.to](http://io.to)(gameSessionID).emit('newGameState', newGameState);
```

---

## Room-Based Broadcasting

### [\*\*Socket.IO](http://Socket.IO) Room Strategy\*\*

```
// Each game = one [Socket.IO](http://Socket.IO) room
const gameSessionID = generateUniqueID();

// Players join room
socket.join(gameSessionID);

// Broadcast to entire room
[io.to](http://io.to)(gameSessionID).emit('newGameState', gameData);
```

### **Advantages**

- ✅ **Efficient broadcasting** - only to relevant players
- ✅ **Isolated games** - events don't leak between games
- ✅ **Scalable** - supports multiple concurrent games
- ✅ **Clean disconnect** - automatic room cleanup

---

## Memory Management & Cleanup

### **Session Lifecycle**

```
// Session creation
gameSessions[gameID] = new GameSession(gameID);

// Player joins
socketIDtoGameSessionID[[socket.id](http://socket.id)] = gameID;
connectedPlayers[[socket.id](http://socket.id)] = new Player(username, [socket.id](http://socket.id));

// Cleanup on disconnect
delete connectedPlayers[[socket.id](http://socket.id)];
delete socketIDtoGameSessionID[[socket.id](http://socket.id)];

// Remove empty sessions
if (session.playerCount === 0) {
  delete gameSessions[gameID];
}
```

### **Prevents Memory Leaks**

- 🛡️ **Automatic cleanup** of disconnected players
- 🛡️ **Empty session removal** prevents zombie games
- 🛡️ **Reference cleanup** in all mapping objects

---

## Architecture Benefits

### **Security & Integrity**

- ✅ **Server-side validation** prevents cheating
- ✅ **Authoritative game state** ensures consistency
- ✅ **Turn enforcement** prevents out-of-order moves
- ✅ **Chess rule validation** ensures legal gameplay

### **Scalability & Performance**

- ✅ **Room isolation** supports multiple games
- ✅ **Efficient broadcasting** only to relevant players
- ✅ **Memory management** prevents server crashes
- ✅ **Event-driven** architecture scales well

### **User Experience**

- ✅ **Real-time sync** between all players
- ✅ **Invalid move feedback** guides players
- ✅ **Game discovery** via available games list
- ✅ **Clean disconnection** handling

---

## Visual Architecture Diagram

```
┌─────────────────────┐    ┌─────────────────────────────────────┐    ┌─────────────────────┐
│     Client A        │    │           Server (Authority)       │    │     Client B        │
│   (UI & Input)      │    │                                     │    │   (UI & Input)      │
│                     │    │  ┌─────────────────────────────────┐ │    │                     │
│ ┌─────────────────┐ │    │  │        Game Logic Layer        │ │    │ ┌─────────────────┐ │
│ │ Canvas Renderer │ │    │  │  ┌─────────────────────────────┐│ │    │ │ Canvas Renderer │ │
│ │ User Input      │ │    │  │  │      GameSession           ││ │    │ │ User Input      │ │
│ │ Socket Client   │ │    │  │  │  ┌─────────────────────────┐││ │    │ │ Socket Client   │ │
│ └─────────────────┘ │    │  │  │  │     GameInstance       │││ │    │ └─────────────────┘ │
│          │          │    │  │  │  │  - Chess Rules         │││ │    │          │          │
│    emit('move')     │    │  │  │  │  - Board State         │││ │    │   on('newGameState') │
│          │          │    │  │  │  │  - Turn Management     │││ │    │          │          │
└──────────┼──────────┘    │  │  │  │  - Move Validation     │││ │    └──────────┼──────────┘
           │               │  │  │  └─────────────────────────┘││ │               │
           │               │  │  └─────────────────────────────┘│ │               │
           │               │  └─────────────────────────────────┘ │               │
           │               │                                       │               │
           │               │  ┌─────────────────────────────────┐ │               │
           │               │  │     Session Management         │ │               │
           │               │  │  - gameSessions{}              │ │               │
           │               │  │  - connectedPlayers{}          │ │               │
           │               │  │  - socketIDtoGameSessionID{}   │ │               │
           │               │  └─────────────────────────────────┘ │               │
           │               │                                       │               │
           │               │  ┌─────────────────────────────────┐ │               │
           └───────────────┼──┤      [Socket.IO](http://Socket.IO) Layer           ├─┼───────────────┘
                           │  │  - Room Broadcasting           │ │
                           │  │  - Event Handling              │ │
                           │  │  - Connection Management       │ │
                           │  └─────────────────────────────────┘ │
                           │                                       │
                           │  ┌─────────────────────────────────┐ │
                           │  │        HTTP Layer              │ │
                           │  │  - Express.js                  │ │
                           │  │  - Static File Serving         │ │
                           │  └─────────────────────────────────┘ │
                           └───────────────────────────────────────┘
```

---

## Implementation Status

### **✅ Completed Features**

- Server-side chess validation
- Game session management
- Room-based broadcasting
- Turn enforcement
- Memory cleanup
- Multi-game support

### **🚧 Current Development Focus**

- Refining game discovery UX
- Enhanced error handling
- Performance optimization
- Testing multiplayer scenarios

This server-side refactor represents a significant architectural improvement, moving from a simple relay to a full-featured, secure, multiplayer chess server with proper state management and validation.
