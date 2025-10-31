import { getNewGameState } from "../../../chessCore/gameLogic/getNewGameState.js";
import { createTestBoard } from "../../helpers/testFactories.js";
import GameStateManager from "../../../chessCore/gameLogic/GameStateManager.js";

describe("getNewGameState", () => {
  let board;
  let gameStateManager;
  let validMoveData;

  beforeEach(() => {
    board = createTestBoard();
    gameStateManager = new GameStateManager(board, "black");
    
    validMoveData = {
      chessPiece: {
        position: { name: "e7" }  // Black pawn since black moves first
      },
      targetSquare: "e5"
    };
  });

  describe("successful moves", () => {
    test("returns success true with gameState for valid move", () => {
      const result = getNewGameState(validMoveData, gameStateManager, board);

      expect(result.success).toBe(true);
      expect(result.gameState).toBeDefined();
      expect(result.gameState.currentGameStateManager).toBe(gameStateManager);
      expect(result.error).toBeUndefined();
    });

    test("handles targetSquare as Position object for backwards compatibility", () => {
      const moveDataWithPositionObject = {
        chessPiece: {
          position: { name: "e7" }
        },
        targetSquare: { name: "e5" }
      };

      const result = getNewGameState(moveDataWithPositionObject, gameStateManager, board);

      expect(result.success).toBe(true);
      expect(result.gameState).toBeDefined();
    });
  });

  describe("error handling", () => {
    test("returns success false when selected piece not found on board", () => {
      const invalidMoveData = {
        chessPiece: {
          position: { name: "z9" }  // Invalid square
        },
        targetSquare: "e4"
      };

      const result = getNewGameState(invalidMoveData, gameStateManager, board);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Selected piece not found on board");
      expect(result.gameState).toBeUndefined();
    });

    test("returns success false with error message for invalid move", () => {
      const invalidMoveData = {
        chessPiece: {
          position: { name: "e7" }
        },
        targetSquare: "e2"  // Invalid pawn move - can't move backwards
      };

      const result = getNewGameState(invalidMoveData, gameStateManager, board);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.gameState).toBeUndefined();
    });

    test("returns success false for wrong player turn", () => {
      // GameStateManager expects black to move first, but piece is white
      const wrongTurnMoveData = {
        chessPiece: {
          position: { name: "e2" }  // White pawn, but black should move first
        },
        targetSquare: "e4"
      };

      const result = getNewGameState(wrongTurnMoveData, gameStateManager, board);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Not your turn");
      expect(result.gameState).toBeUndefined();
    });

    test("returns success false for invalid moves with appropriate error message", () => {
      // Test pawn trying to move diagonally to its own piece
      const captureOwnPieceData = {
        chessPiece: {
          position: { name: "d7" }  // Black pawn
        },
        targetSquare: "e7"  // Another black piece position (e7 has a black pawn)
      };

      const result = getNewGameState(captureOwnPieceData, gameStateManager, board);

      expect(result.success).toBe(false);
      expect(result.error).toContain("not a legal move");
      expect(result.gameState).toBeUndefined();
    });
  });
});

