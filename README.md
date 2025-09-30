Click Here to play the intial demo (lightweight client side version)

https://multiplayer-chess-qh1o.onrender.com/ 


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

- **Express.js** serves static files and web requests (`backend/server.js`)
- Basic web server functionality for frontend delivery
- Entry point: `npm start` → runs `backend/server.js`

### **2. WebSocket Layer (Socket.IO)**

- **Real-time Communication**: Bidirectional client-server events via Socket.IO
- **Room-based Broadcasting**: Each game session is isolated in its own room
- **Event-driven Architecture**: Handles connection, game creation, moves, disconnection
- **Entry Point**: `backend/gameSetup/launchServer.js` sets up all socket listeners

### **3. Session Management Layer**

- **SessionManager** (`backend/gameSetup/SessionManager.js`): Game-agnostic networking layer
  - Manages `gameSessions`, `connectedPlayers`, `socketIDtoGameSessionID` mappings
  - Provides clean API for session/player lookup and management
  - Handles automatic cleanup when players disconnect
- **GameSession** (`backend/gameSetup/gameSession.js`): Container for individual game instances
  - Manages `connectedUsers` as single source of truth for players in a session
  - Delegates color assignment to game-specific logic via `chessColorAssignment.js`
  - Creates and manages `GameInstance` objects
- **Player** (`backend/gameSetup/Player.js`): Represents individual connected users
  - Stores username, socketID, and assigned game color

### **4. Game Logic Layer**

- **GameInstance** (`backend/gameSetup/GameInstance.js`): Game-specific logic container
  - Contains `Board` and `GameStateManager` for chess implementation
  - Extensible design for future games (checkers, tic-tac-toe, etc.)
- **GameStateManager** (`backend/gameLogic/GameStateManager.js`): Core game controller
  - Handles move validation, turn switching, game status tracking
  - Manages captured pieces and game ending conditions
  - Contains `TurnManager` for player turn logic
- **Board** (`backend/gameLogic/board.js`): Chess board state and piece management
- **Chess Pieces** (`backend/chessPieces/`): Individual piece logic with movement rules
- **Support Modules**:
  - `chessColorAssignment.js`: Chess-specific color assignment logic
  - `position.js`: Board position utilities
  - `constants.js`: Shared game constants and enums

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

### **Key Abstractions & Responsibilities**

**🌐 Networking Layer (Game-Agnostic)**:

- **SessionManager**: Central hub for all session and player management operations
  - Replaces the previous "Database" naming for clarity (it's not actually a database)
  - Methods: `addSession()`, `removeSession()`, `getSessionById()`, `getPlayerBySocketId()`
  - Handles socket-to-session mapping and automatic cleanup
- **GameSession**: Manages individual game instances and their connected players
  - Single source of truth: `connectedUsers` array tracks all players in the session
  - Delegates game-specific logic to appropriate modules (e.g., chess color assignment)
- **Player**: Represents a connected user with username, socketID, and game color

**🎮 Game Logic Layer (Game-Specific)**:

- **GameInstance**: Container for game-specific state and rules
  - Chess implementation: Contains `Board` and `GameStateManager`
  - Extensible for future games: checkers, tic-tac-toe, custom games
- **GameStateManager**: Core game controller for moves, turns, and win conditions
- **TurnManager**: Handles player turn switching and validation
- **Game Components**: Chess pieces with individual movement rules and validation

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

| Event                   | Payload                  | Purpose                    |
| ----------------------- | ------------------------ | -------------------------- |
| `connection`            | `{username}`             | Initial connection         |
| `getAvailableGames`     | `{}`                     | Request game list          |
| `createNewChessGame`    | `{}`                     | Start new chess session    |
| `createNewCheckersGame` | `{}`                     | Start new checkers session |
| `joinExistingGame`      | `{gameID}`               | Join existing session      |
| `move`                  | `{gameSpecificMoveData}` | Attempt game move          |
| `disconnect`            | `{}`                     | Player disconnection       |

### **Server → Client Events**

| Event                           | Payload                 | Purpose                  |
| ------------------------------- | ----------------------- | ------------------------ |
| `welcome`                       | `{message}`             | Connection confirmation  |
| `availableGames`                | `{games[]}`             | List of joinable games   |
| `playerInfoAndInitialGameState` | `{color, gameInstance}` | Game setup data          |
| `newGameState`                  | `{gameInstance}`        | Updated board after move |
| `notYourTurn`                   | `{message}`             | Invalid turn attempt     |
| `error`                         | `{errorMessage}`        | Move validation failure  |
| `playerDisconnected`            | `{message}`             | Opponent left game       |

---

## Platform Architecture & Extensibility

### **Separation of Concerns & Data Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                🌐 NETWORKING LAYER                          │
│            (Game-Agnostic Architecture)                     │
│                                                             │
│  SessionManager:                                            │
│  ├── getGameInstanceBySocket()                              │
│  ├── getPlayerBySocketId()                                  │
│  ├── getSessionIdBySocket()                                 │
│  └── Automatic session cleanup                             │
│                                                             │
│  GameSession:                                               │
│  ├── connectedUsers[] (single source of truth)             │
│  ├── Player management                                      │
│  └── Delegates to game-specific logic                      │
│                                                             │
│  handleMove() - Orchestrates between layers                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 🎮 GAME LOGIC LAYER                         │
│            (Game-Specific Implementations)                  │
│                                                             │
│   Chess Engine:                                             │
│   ├── GameInstance → Board + GameStateManager              │
│   ├── GameStateManager → TurnManager + move validation     │
│   ├── ChessPieces → Individual piece movement rules        │
│   └── chessColorAssignment → Player color logic            │
│                                                             │
│   Future Games:                                             │
│   ├── CheckersInstance → CheckersBoard + Rules             │
│   ├── TicTacToeInstance → TicTacToeBoard + Rules           │
│   └── CustomGameInstance → Custom logic                    │
│                                                             │
│   Each game validates:                                      │
│   ├── Turn order and player validation                     │
│   ├── Game-specific move rules                             │
│   ├── Win/lose conditions                                  │
│   └── State transitions                                    │
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
const currentPlayerColour =
  gameInstance.gameStateManager.turnManager.currentPlayerColour;
if (player.colour !== currentPlayerColour) {
  socket.emit("notYourTurn");
  return;
}
```

**Future Checkers Turn Validation**:

```javascript
const currentPlayerColour =
  gameInstance.checkersStateManager.turnManager.currentPlayerColour;
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

## Project Structure & Testing

### **📁 Directory Organization**

```
Chess_CS50_v2/
├── backend/
│   ├── gameSetup/              # 🌐 Networking & Session Management
│   │   ├── SessionManager.js   # Central session management hub
│   │   ├── gameSession.js      # Individual game session container
│   │   ├── Player.js           # Player data representation
│   │   ├── GameInstance.js     # Game-specific logic container
│   │   └── launchServer.js     # Socket.IO event setup
│   ├── gameLogic/              # 🎮 Chess Game Engine
│   │   ├── GameStateManager.js # Core game controller
│   │   ├── board.js            # Chess board state
│   │   ├── turnManager.js      # Turn switching logic
│   │   ├── chessColorAssignment.js # Color assignment rules
│   │   └── position.js         # Board position utilities
│   ├── chessPieces/            # ♟️ Individual Chess Pieces
│   │   └── [piece].js          # King, Queen, Rook, Bishop, Knight, Pawn
│   ├── helpers/                # 🔧 Utility Functions
│   └── server.js               # 🚀 Application entry point
├── public/                     # 🎨 Frontend (Static Files)
│   ├── src/frontend/           # Frontend JavaScript modules
│   └── index.html              # Main game interface
├── shared/                     # 📋 Shared Constants & Utilities
├── tests/                      # 🧪 Comprehensive Test Suite
│   ├── unit/                   # Unit tests by domain
│   │   ├── chess-pieces/       # Individual piece testing
│   │   ├── core-logic/         # Game logic testing
│   │   └── networking/         # Session management testing
│   ├── integration/            # Integration tests
│   ├── helpers/                # Test utilities and factories
└── e2e/                        # 🎭 End-to-End Tests (Playwright)
```

### **🧪 Testing Strategy**

**Test Organization by Domain**:

- **Unit Tests**: Isolated testing of individual classes and functions
  - `chess-pieces/`: Each piece type thoroughly tested
  - `core-logic/`: Game state, board, turn management
  - `networking/`: Session management, player handling
- **Integration Tests**: Cross-module interaction testing
- **E2E Tests**: Full user workflow testing with Playwright

**Test Commands**:

```bash
npm test                    # Run all unit/integration tests
npm run test:playwright     # Run end-to-end tests
npm run test:filter -- "SessionManager"  # Run specific test pattern
```

---

## 🔄 Recent Architectural Improvements

### **Major Refactoring (2025)**

**Session Management Modernization**:

- **Renamed "Database" → "SessionManager"** for clearer purpose (it's not actually a database)
- **Extracted Chess Logic**: Created `chessColorAssignment.js` module for game-specific color assignment
- **Single Source of Truth**: `GameSession.connectedUsers` now manages all player state
- **Cleaner APIs**: `addSession()`, `removeSession()` vs. previous `createSession()`, `deleteSession()`

**Test Suite Reorganization**:

- **Domain-based Structure**: Tests organized by functionality (chess-pieces, core-logic, networking)
- **Test Factories**: Centralized object creation for consistent test data
- **Integration Testing**: Cross-module interaction validation
- **Comprehensive Coverage**: Unit, integration, and E2E testing

**Code Quality Improvements**:

- **Architectural Consistency**: Fixed mismatches between class definitions and usage patterns
- **Separation of Concerns**: Clear boundaries between networking layer and game logic
- **Modularity**: Each file/class has single responsibility
- **Documentation**: Comprehensive JSDoc comments throughout codebase

**Why These Changes Matter**:

- **Before**: Color assignment logic duplicated across multiple classes
- **After**: Clean separation — SessionManager handles networking, chessColorAssignment handles game rules
- **Result**: Easier to add new games, cleaner testing, better maintainability

---

## Implementation Status

### **✅ Platform Foundation Complete**

- ✅ **Modular Architecture**: Clean separation between networking and game logic
- ✅ **SessionManager**: Game-agnostic session and player management (replaces "Database")
- ✅ **Chess Implementation**: Full chess game with complete rule validation
- ✅ **Real-time Multiplayer**: WebSocket communication with room isolation
- ✅ **Server Authority**: Anti-cheat protection and state validation
- ✅ **Memory Management**: Automatic cleanup and leak prevention
- ✅ **Extensible Design**: Framework ready for new game types
- ✅ **Comprehensive Testing**: Unit, integration, and E2E test coverage

### **🎮 Game Implementations**

- ✅ **Chess**: Complete implementation with full rule validation
  - All piece types with proper movement rules
  - Turn management and move validation
  - Captured piece tracking
  - Game state management (ongoing, checkmate, stalemate)
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
