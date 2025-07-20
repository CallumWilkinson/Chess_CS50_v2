**🚧 Active Development**: server-side-refactor branch

**📦 Repository**: https://github.com/CallumWilkinson/Chess_CS50_v2/tree/server-side-refactor

---

# Multiplayer Game Platform

## Vision

**Core Philosophy**: Extensible multiplayer game platform with modular game engine architecture

This project is designed as a **multiplayer game platform** that can support various turn-based games, starting with chess as the first implementation. The architecture separates networking concerns from game-specific logic, making it easy to add new games like checkers, tic-tac-toe, or any custom board game.

### **Platform Features**
- **🎮 Multi-Game Support**: Extensible architecture for different game types
- **🔗 Real-Time Multiplayer**: WebSocket-based real-time communication
- **🛡️ Server Authority**: Anti-cheat protection with server-side validation
- **🎯 Session Management**: Robust player and game session handling
- **📈 Scalable Design**: Support for multiple concurrent games

### **Current Games**
- ✅ **Chess**: Full implementation with complete rule validation
- 🔄 **Checkers**: Planned next implementation
- 🔄 **Custom Games**: Framework ready for new game types

---

## Architecture Overview

**Core Philosophy**: Server-authoritative game platform with clean separation of concerns

- **Networking Layer**: Socket.IO with Database API for session management
- **Game Logic Layer**: Modular game engines (chess, future checkers, etc.)
- **Client Layer**: UI rendering and input handling
- **Communication**: Room-based broadcasting for isolated game sessions

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

- **Modular Game Engines**: Independent game implementations
  - **Chess Engine**: Complete chess rules and validation
  - **Future Games**: Checkers, tic-tac-toe, custom games
- **Game-Specific Logic**: Move validation, rule enforcement, win conditions
- **Turn Management**: Game-specific turn handling and state tracking

### **4. Session Management (Database Layer)**

- **Networking-Focused**: Pure session and connection management
- **Game-Agnostic**: Works with any game type without modification
- **Features**:
  - Player/session mapping and tracking
  - Game instance retrieval and management
  - Socket connection management
  - Automatic cleanup of empty sessions

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

### **Platform Class Architecture**

**Networking Layer (Game-Agnostic)**:
- **Database**: Session management, player tracking, socket mapping
- **GameSession**: Session coordination and player management
- **Player**: User data and connection info

**Game Logic Layer (Game-Specific)**:
- **GameInstance**: Game-specific state and rules engine
  - **Chess**: `ChessInstance` with chess board, pieces, rules
  - **Future**: `CheckersInstance`, `TicTacToeInstance`, etc.
- **Game Components**: Pieces, boards, rules specific to each game type

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
    ↓ emit("createNewChessGame") // Future: "createNewCheckersGame", etc.
Server
    ↓ creates new GameSession
    ↓ creates new GameInstance (chess/checkers/other)
    ↓ assigns player color using game-specific logic
    ↓ socket.join(gameSessionID)
    ↓ Database maps socketID → gameSessionID
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
    ↓ emit("move", {gameSpecificMoveData})
Server Validation (Layered Architecture)
    ↓ Database layer: retrieves game instance and player info
    ↓ Game layer: validates turn order using game instance
    ↓ Game layer: validates game-specific rules (chess/checkers/etc.)
    ↓ Game layer: updates game state
    ↓ Networking layer: broadcasts to room
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

| Event                   | Payload                        | Purpose                      |
| ----------------------- | ------------------------------ | ---------------------------- |
| `connection`            | `{username}`                   | Initial connection           |
| `getAvailableGames`     | `{}`                           | Request game list            |
| `createNewChessGame`    | `{}`                           | Start new chess session     |
| `createNewCheckersGame` | `{}`                           | Start new checkers session  |
| `joinExistingGame`      | `{gameID}`                     | Join existing session       |
| `move`                  | `{gameSpecificMoveData}`       | Attempt game move            |
| `disconnect`            | `{}`                           | Player disconnection         |

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

## Platform Architecture & Extensibility

### **Separation of Concerns**

```
┌─────────────────────────────────────────────────────────────┐
│                 NETWORKING LAYER                            │
│  (Game-Agnostic - Works with any game type)                │
│                                                             │
│  Database API:                                              │
│  - getGameInstanceBySocket()                                │
│  - getPlayerBySocketId()                                    │
│  - getSessionIdBySocket()                                   │
│                                                             │
│  handleMove() - Orchestrates between layers                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  GAME LOGIC LAYER                           │
│   (Game-Specific - Each game implements its own rules)     │
│                                                             │
│   Chess:     gameInstance.gameStateManager.turnManager     │
│   Checkers:  gameInstance.checkersStateManager.turnManager │
│   Custom:    gameInstance.customStateManager.turnManager   │
│                                                             │
│   Each game validates its own:                              │
│   - Turn order and player validation                       │
│   - Game-specific move rules                               │
│   - Win/lose conditions                                    │
│   - State transitions                                      │
└─────────────────────────────────────────────────────────────┘
```

### **Adding New Games**

To add a new game type (e.g., Checkers):

1. **Create Game Instance Class**:
   ```javascript
   class CheckersInstance {
     constructor() {
       this.board = new CheckersBoard();
       this.gameStateManager = new CheckersStateManager();
     }
     
     createNewCheckersGame() {
       // Checkers-specific setup
     }
   }
   ```

2. **Add Socket Event Handler**:
   ```javascript
   socket.on("createNewCheckersGame", () => {
     createNewSession(database, "checkers");
   });
   ```

3. **No Database Changes Required**: The networking layer works with any game type

### **Game-Specific Validation Examples**

**Chess Turn Validation**:
```javascript
const currentPlayerColour = gameInstance.gameStateManager.turnManager.currentPlayerColour;
if (player.colour !== currentPlayerColour) {
  socket.emit("notYourTurn");
  return;
}
```

**Future Checkers Turn Validation**:
```javascript
const currentPlayerColour = gameInstance.checkersStateManager.turnManager.currentPlayerColour;
if (player.colour !== currentPlayerColour) {
  socket.emit("notYourTurn");
  return;
}
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

## Platform Benefits

### **Extensibility & Modularity**

- ✅ **Game-Agnostic Networking**: Database layer works with any game type
- ✅ **Clean Separation**: Networking logic separate from game logic
- ✅ **Easy Game Addition**: Add new games without changing core platform
- ✅ **Modular Architecture**: Each game implements its own rules independently

### **Security & Integrity**

- ✅ **Server-side validation** prevents cheating across all game types
- ✅ **Authoritative game state** ensures consistency for any game
- ✅ **Turn enforcement** prevents out-of-order moves per game rules
- ✅ **Game-specific rule validation** ensures legal gameplay

### **Scalability & Performance**

- ✅ **Multi-game support** - chess, checkers, custom games simultaneously
- ✅ **Room isolation** supports multiple concurrent games of different types
- ✅ **Efficient broadcasting** only to relevant players per game
- ✅ **Memory management** prevents server crashes regardless of game type
- ✅ **Event-driven** architecture scales well with game complexity

### **Developer Experience**

- ✅ **Clean APIs**: Database provides clear networking interface
- ✅ **Testing**: Game logic and networking can be tested independently
- ✅ **Maintainability**: Changes to one game don't affect others
- ✅ **Documentation**: Clear patterns for adding new game types

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

### **✅ Platform Foundation Complete**

- ✅ **Modular Architecture**: Clean separation between networking and game logic
- ✅ **Database Layer**: Game-agnostic session and player management
- ✅ **Chess Implementation**: Full chess game with complete rule validation
- ✅ **Real-time Multiplayer**: WebSocket communication with room isolation
- ✅ **Server Authority**: Anti-cheat protection and state validation
- ✅ **Memory Management**: Automatic cleanup and leak prevention
- ✅ **Extensible Design**: Framework ready for new game types

### **🎮 Game Implementations**

- ✅ **Chess**: Complete implementation with full rule validation
- 🔄 **Checkers**: Next planned game implementation
- 🔄 **Tic-Tac-Toe**: Simple game for testing rapid development
- 🔄 **Custom Games**: Framework supports any turn-based game

### **🚧 Platform Development Focus**

- **Game Discovery UX**: Enhanced browsing and filtering of available games
- **Game Type Selection**: UI for choosing between chess, checkers, etc.
- **Spectator Mode**: Allow users to watch ongoing games
- **Game History**: Replay and analysis features
- **Performance Optimization**: Handling many concurrent games
- **Advanced Features**: Tournaments, rankings, matchmaking

### **🎯 Project Vision**

This project has evolved from a chess application into a **comprehensive multiplayer game platform**. The modular architecture enables rapid development of new game types while maintaining robust networking, security, and performance. The goal is to create a platform where developers can easily add new turn-based games and players can enjoy a variety of real-time multiplayer experiences.
