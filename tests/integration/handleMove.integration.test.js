import { jest } from "@jest/globals";
import { handleMove } from "../../backend/helpers/handleMove.js";
import Position from "../../core/gameLogic/position.js";
import Pawn from "../../core/chessPieces/pawn.js";
import { createTestScenario, TEST_PLAYERS } from "../helpers/testFactories.js";

//integration tests for refactored handleMove function using SessionManager API
describe("HandleMove Integration with SessionManager", () => {
  let testScenario;
  let mockSocket;
  let mockIo;

  beforeEach(() => {
    //create complete test scenario using factory
    testScenario = createTestScenario([
      { username: "player1", socketId: "socket1", colour: "black" },
      { username: "player2", socketId: "socket2", colour: "white" },
    ]);

    mockSocket = {
      id: "socket1",
      emit: jest.fn(),
    };

    mockIo = {
      to: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
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

    handleMove(mockSocket, validMoveData, testScenario.sessionManager, mockIo);

    //should not emit "notYourTurn" error
    expect(mockSocket.emit).not.toHaveBeenCalledWith("notYourTurn");

    //should emit new game state to all players in the room
    expect(mockIo.to).toHaveBeenCalledWith(testScenario.sessionId);
  });

  test("handleMove rejects move when not player's turn", () => {
    //create white player socket trying to move on black's turn
    const whitePlayerSocket = {
      id: "socket2",
      emit: jest.fn(),
    };

    //try to move a white pawn when it's black's turn
    const e2 = new Position("e2");
    const whitePawn = new Pawn("white", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: whitePawn,
      targetSquare: e4,
    };

    handleMove(
      whitePlayerSocket,
      moveData,
      testScenario.sessionManager,
      mockIo
    );

    //should emit "notYourTurn" error
    expect(whitePlayerSocket.emit).toHaveBeenCalledWith("notYourTurn");

    //should not emit new game state
    expect(mockIo.to).not.toHaveBeenCalled();
  });

  test("handleMove handles unmapped socket gracefully", () => {
    const unmappedSocket = {
      id: "nonexistent",
      emit: jest.fn(),
    };

    const e2 = new Position("e2");
    const blackPawn = new Pawn("black", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: e4,
    };

    handleMove(unmappedSocket, moveData, testScenario.sessionManager, mockIo);

    //should emit "Game session not found" error since socket is not mapped to any session
    expect(unmappedSocket.emit).toHaveBeenCalledWith(
      "error",
      "Game session not found"
    );
  });

  test("handleMove handles missing game instance gracefully", () => {
    //create a session using factory and then break it
    const brokenScenario = createTestScenario([
      { username: "player3", socketId: "socket3", colour: "black" },
    ]);

    //break the game instance to test error handling
    brokenScenario.session.gameInstance = null;

    const brokenSocket = {
      id: "socket3",
      emit: jest.fn(),
    };

    const e2 = new Position("e2");
    const blackPawn = new Pawn("black", e2);
    const e4 = new Position("e4");
    const moveData = {
      chessPiece: blackPawn,
      targetSquare: e4,
    };

    handleMove(brokenSocket, moveData, brokenScenario.sessionManager, mockIo);

    //should emit "Game session not found" error because game instance is null
    expect(brokenSocket.emit).toHaveBeenCalledWith(
      "error",
      "Game session not found"
    );
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

    //call handleMove with only sessionManager - no global objects passed
    handleMove(mockSocket, validMoveData, testScenario.sessionManager, mockIo);

    //verify it worked by checking the game state was emitted
    expect(mockIo.to).toHaveBeenCalledWith(testScenario.sessionId);
    expect(mockIo.to().emit).toHaveBeenCalledWith(
      "newGameState",
      expect.any(Object)
    );
  });

  test("sessionManager methods work correctly for networking purposes", () => {
    //test the specific Database methods used by handleMove for networking/session management

    //getGameInstanceBySocket should return correct instance
    const retrievedInstance =
      testScenario.sessionManager.getGameInstanceBySocket("socket1");
    expect(retrievedInstance).toBe(testScenario.session.gameInstance);

    //getSessionIdBySocket should return correct session ID
    const sessionId =
      testScenario.sessionManager.getSessionIdBySocket("socket1");
    expect(sessionId).toBe(testScenario.sessionId);

    //getPlayerBySocketId should return correct player
    const retrievedPlayer =
      testScenario.sessionManager.getPlayerBySocketId("socket1");
    expect(retrievedPlayer.colour).toBe("black");
    expect(retrievedPlayer.username).toBe("player1");
  });
});
