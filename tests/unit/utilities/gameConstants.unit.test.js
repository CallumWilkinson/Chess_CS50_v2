import { 
  ChessConstants, 
  CoordinateConstants, 
  SystemConstants, 
  MovementConstants 
} from "../../../shared/utilities/gameConstants.js";

describe("gameConstants", () => {
  describe("ChessConstants", () => {
    test("should have correct board dimensions", () => {
      expect(ChessConstants.BOARD_SIZE).toBe(8);
      expect(ChessConstants.TOTAL_SQUARES).toBe(64);
      expect(ChessConstants.BOARD_SIZE * ChessConstants.BOARD_SIZE).toBe(ChessConstants.TOTAL_SQUARES);
    });

    test("should have correct piece counts", () => {
      expect(ChessConstants.TOTAL_PIECES).toBe(32);
      expect(ChessConstants.PIECES_PER_COLOR).toBe(16);
      expect(ChessConstants.PAWNS_PER_COLOR).toBe(8);
      expect(ChessConstants.PIECES_PER_COLOR * 2).toBe(ChessConstants.TOTAL_PIECES);
    });

    test("should have correct game settings", () => {
      expect(ChessConstants.MAX_PLAYERS).toBe(2);
      expect(ChessConstants.WHITE_PAWN_RANK).toBe("2");
      expect(ChessConstants.BLACK_PAWN_RANK).toBe("7");
    });

    test("should have correct movement constants", () => {
      expect(ChessConstants.KING_MOVEMENT_RANGE).toBe(1);
      expect(ChessConstants.PAWN_SINGLE_MOVE).toBe(1);
      expect(ChessConstants.PAWN_DOUBLE_MOVE).toBe(2);
      expect(ChessConstants.KNIGHT_LONG_MOVE).toBe(2);
      expect(ChessConstants.KNIGHT_SHORT_MOVE).toBe(1);
    });
  });

  describe("CoordinateConstants", () => {
    test("should have correct ASCII values and indices", () => {
      expect(CoordinateConstants.ASCII_FILE_A).toBe(97);
      expect(String.fromCharCode(CoordinateConstants.ASCII_FILE_A)).toBe("a");
    });

    test("should have correct index bounds", () => {
      expect(CoordinateConstants.MIN_FILE_INDEX).toBe(0);
      expect(CoordinateConstants.MAX_FILE_INDEX).toBe(7);
      expect(CoordinateConstants.MIN_RANK_INDEX).toBe(0);
      expect(CoordinateConstants.MAX_RANK_INDEX).toBe(7);
    });

    test("should have correct conversion offset", () => {
      expect(CoordinateConstants.RANK_INDEX_OFFSET).toBe(1);
    });

    test("should maintain coordinate consistency", () => {
      expect(CoordinateConstants.MAX_FILE_INDEX - CoordinateConstants.MIN_FILE_INDEX + 1).toBe(ChessConstants.BOARD_SIZE);
      expect(CoordinateConstants.MAX_RANK_INDEX - CoordinateConstants.MIN_RANK_INDEX + 1).toBe(ChessConstants.BOARD_SIZE);
    });
  });

  describe("SystemConstants", () => {
    test("should have correct server settings", () => {
      expect(SystemConstants.DEFAULT_PORT).toBe(3000);
      expect(typeof SystemConstants.DEFAULT_PORT).toBe("number");
    });

    test("should have correct ID generation settings", () => {
      expect(SystemConstants.ID_LENGTH).toBe(6);
      expect(SystemConstants.RANDOM_STRING_RADIX).toBe(36);
      expect(SystemConstants.RANDOM_STRING_START).toBe(2);
      expect(SystemConstants.RANDOM_STRING_END).toBe(8);
    });

    test("should have consistent ID generation parameters", () => {
      expect(SystemConstants.RANDOM_STRING_END - SystemConstants.RANDOM_STRING_START).toBe(SystemConstants.ID_LENGTH);
    });

    test("should have correct array manipulation constants", () => {
      expect(SystemConstants.SINGLE_ITEM_REMOVAL).toBe(1);
    });
  });

  describe("MovementConstants", () => {
    test("should have correct directional values", () => {
      expect(MovementConstants.WHITE_DIRECTION).toBe(1);
      expect(MovementConstants.BLACK_DIRECTION).toBe(-1);
      expect(MovementConstants.NO_FILE_MOVEMENT).toBe(0);
      expect(MovementConstants.NO_RANK_MOVEMENT).toBe(0);
    });

    test("should have opposite white and black directions", () => {
      expect(MovementConstants.WHITE_DIRECTION).toBe(-MovementConstants.BLACK_DIRECTION);
    });
  });

  describe("constant immutability", () => {
    test("constants should maintain expected values", () => {
      // Even though constants can be modified, they should start with expected values
      expect(ChessConstants.BOARD_SIZE).toBe(8);
      expect(ChessConstants.TOTAL_SQUARES).toBe(64);
      expect(ChessConstants.MAX_PLAYERS).toBe(2);
    });
  });

  describe("integration with chess logic", () => {
    test("knight movement constants work together", () => {
      const longMove = ChessConstants.KNIGHT_LONG_MOVE;
      const shortMove = ChessConstants.KNIGHT_SHORT_MOVE;
      
      // Knight moves should form L-shape
      expect(longMove).toBeGreaterThan(shortMove);
      expect(longMove + shortMove).toBe(3); // Total Manhattan distance
    });

    test("pawn movement constants are logical", () => {
      expect(ChessConstants.PAWN_DOUBLE_MOVE).toBe(ChessConstants.PAWN_SINGLE_MOVE * 2);
    });

    test("board and coordinate constants align", () => {
      expect(CoordinateConstants.MAX_FILE_INDEX).toBe(7); // Should be 7 for 8x8 board
      expect(CoordinateConstants.MAX_RANK_INDEX).toBe(7); // Should be 7 for 8x8 board
      expect(CoordinateConstants.MAX_FILE_INDEX - CoordinateConstants.MIN_FILE_INDEX + 1).toBe(8);
      expect(CoordinateConstants.MAX_RANK_INDEX - CoordinateConstants.MIN_RANK_INDEX + 1).toBe(8);
    });
  });
});