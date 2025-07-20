import { jest } from "@jest/globals";
import { handleMove } from "../backend/helpers/handleMove.js";
import Database from "../backend/gameSetup/Database.js";
import GameSession from "../backend/gameSetup/gameSession.js";
import Player from "../backend/gameSetup/Player.js";
import Position from "../backend/gameLogic/position.js";
import Pawn from "../backend/chessPieces/pawn.js";

//integration tests for refactored handleMove function using Database API
describe("HandleMove Integration with Database", () => {
  let database;
  let mockSocket;
  let mockIo;
  let gameSession;
  let gameInstance;

  beforeEach(() => {
    //create database and mock objects
    database = new Database();
    
    mockSocket = {
      id: "socket1",
      emit: jest.fn()
    };
    
    mockIo = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn()
      })
    };

    //setup a complete game session with players
    gameSession = new GameSession();
    gameInstance = gameSession.createGameInstance();
    gameInstance.createNewChessGame();
    
    //create players
    const blackPlayer = new Player("player1", "socket1", "black");
    const whitePlayer = new Player("player2", "socket2", "white");
    
    //add players to database
    database.addPlayer("socket1", blackPlayer);
    database.addPlayer("socket2", whitePlayer);
    
    //create session in database
    database.createSession(gameSession.gameSessionID, gameSession);
    database.mapSocketToSession("socket1", gameSession.gameSessionID);
    database.mapSocketToSession("socket2", gameSession.gameSessionID);
    
    //setup session players structure (legacy format for compatibility)
    gameSession.connectedPlayersSocketIDs = {
      players: {
        socket1: blackPlayer,
        socket2: whitePlayer
      }
    };
  });

  test("handleMove allows valid move for current player", () => {
    //black player makes the first move (game starts with black's turn)
    //move a black pawn from a7 to a6
    const a7 = new Position("a7");
    const blackPawn = new Pawn("black", a7);
    const a6 = new Position("a6");
    const validMoveData = {
      chessPiece: blackPawn,
      targetSquare: a6,
    };
    
    handleMove(mockSocket, validMoveData, database, mockIo);
    
    //should not emit "notYourTurn" error
    expect(mockSocket.emit).not.toHaveBeenCalledWith("notYourTurn");
    
    //should emit new game state to all players in the room
    expect(mockIo.to).toHaveBeenCalledWith(gameSession.gameSessionID);
  });

  test("handleMove rejects move when not player's turn", () => {
    //create white player socket trying to move on black's turn
    const whitePlayerSocket = {
      id: "socket2",
      emit: jest.fn()
    };
    
    //try to move a white pawn when it's black's turn
    const e2 = new Position("e2");
    const whitePawn = new Pawn("white", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: whitePawn,
      targetSquare: e4,
    };
    
    handleMove(whitePlayerSocket, moveData, database, mockIo);
    
    //should emit "notYourTurn" error
    expect(whitePlayerSocket.emit).toHaveBeenCalledWith("notYourTurn");
    
    //should not emit new game state
    expect(mockIo.to).not.toHaveBeenCalled();
  });

  test("handleMove handles unmapped socket gracefully", () => {
    const unmappedSocket = {
      id: "nonexistent",
      emit: jest.fn()
    };
    
    const e2 = new Position("e2");
    const blackPawn = new Pawn("black", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: e4,
    };
    
    handleMove(unmappedSocket, moveData, database, mockIo);
    
    //should emit "Game session not found" error since socket is not mapped to any session
    expect(unmappedSocket.emit).toHaveBeenCalledWith("error", "Game session not found");
  });

  test("handleMove handles missing game instance gracefully", () => {
    //create a player mapped to a session without a game instance
    const brokenSession = new GameSession();
    brokenSession.gameInstance = null;
    
    database.createSession("broken123", brokenSession);
    database.mapSocketToSession("socket3", "broken123");
    
    const playerWithBrokenSession = new Player("player3", "socket3", "black");
    database.addPlayer("socket3", playerWithBrokenSession);
    
    const brokenSocket = {
      id: "socket3",
      emit: jest.fn()
    };
    
    const e2 = new Position("e2");
    const blackPawn = new Pawn("black", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: e4,
    };
    
    handleMove(brokenSocket, moveData, database, mockIo);
    
    //should emit "Game session not found" error because game instance is null
    expect(brokenSocket.emit).toHaveBeenCalledWith("error", "Game session not found");
  });

  test("handleMove properly decouples from global objects", () => {
    //this test verifies that handleMove no longer depends on global gameSessions or socketIDtoGameSessionID
    //by testing that it works purely through the Database API
    
    const a7 = new Position("a7");
    const blackPawn = new Pawn("black", a7);
    const a6 = new Position("a6");
    const validMoveData = {
      chessPiece: blackPawn,
      targetSquare: a6,
    };
    
    //call handleMove with only database - no global objects passed
    handleMove(mockSocket, validMoveData, database, mockIo);
    
    //verify it worked by checking the game state was emitted
    expect(mockIo.to).toHaveBeenCalledWith(gameSession.gameSessionID);
    expect(mockIo.to().emit).toHaveBeenCalledWith("newGameState", expect.any(Object));
  });

  test("database methods work correctly for networking purposes", () => {
    //test the specific Database methods used by handleMove for networking/session management
    
    //getGameInstanceBySocket should return correct instance
    const retrievedInstance = database.getGameInstanceBySocket("socket1");
    expect(retrievedInstance).toBe(gameInstance);
    
    //getSessionIdBySocket should return correct session ID
    const sessionId = database.getSessionIdBySocket("socket1");
    expect(sessionId).toBe(gameSession.gameSessionID);
    
    //getPlayerBySocketId should return correct player
    const retrievedPlayer = database.getPlayerBySocketId("socket1");
    expect(retrievedPlayer.colour).toBe("black");
    expect(retrievedPlayer.username).toBe("player1");
  });
});