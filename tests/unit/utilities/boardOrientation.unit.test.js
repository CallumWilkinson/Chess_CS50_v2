import {
  transformCoordinatesForPlayer,
  shouldFlipBoard,
} from "../../../public/src/frontend/shared/utilities/boardOrientation.js";

describe("Board Orientation Utilities", () => {
  describe("shouldFlipBoard", () => {
    test("should return true for white player", () => {
      expect(shouldFlipBoard("white")).toBe(true);
    });

    test("should return false for black player", () => {
      expect(shouldFlipBoard("black")).toBe(false);
    });

    test("should return false for null player color", () => {
      expect(shouldFlipBoard(null)).toBe(false);
    });

    test("should return false for undefined player color", () => {
      expect(shouldFlipBoard(undefined)).toBe(false);
    });

    test("should return false for invalid player color", () => {
      expect(shouldFlipBoard("invalid")).toBe(false);
    });
  });

  describe("transformCoordinatesForPlayer", () => {
    describe("black player coordinates (no transformation)", () => {
      test("should not transform coordinates for black player", () => {
        const result = transformCoordinatesForPlayer(0, 0, "black");
        expect(result).toEqual({ rank: 0, file: 0 });
      });

      test("should handle bottom-right corner for black player", () => {
        const result = transformCoordinatesForPlayer(7, 7, "black");
        expect(result).toEqual({ rank: 7, file: 7 });
      });
    });

    describe("white player coordinates (flip transformation)", () => {
      test("should flip top-left to bottom-right for white player", () => {
        const result = transformCoordinatesForPlayer(0, 0, "white");
        expect(result).toEqual({ rank: 7, file: 7 });
      });

      test("should flip bottom-right to top-left for white player", () => {
        const result = transformCoordinatesForPlayer(7, 7, "white");
        expect(result).toEqual({ rank: 0, file: 0 });
      });

      test("should flip center coordinates for white player", () => {
        const result = transformCoordinatesForPlayer(3, 4, "white");
        expect(result).toEqual({ rank: 4, file: 3 });
      });

      test("should handle edge cases for white player", () => {
        const result1 = transformCoordinatesForPlayer(0, 7, "white");
        expect(result1).toEqual({ rank: 7, file: 0 });

        const result2 = transformCoordinatesForPlayer(7, 0, "white");
        expect(result2).toEqual({ rank: 0, file: 7 });
      });
    });

    describe("edge cases", () => {
      test("should default to black behavior for null player color", () => {
        const result = transformCoordinatesForPlayer(2, 3, null);
        expect(result).toEqual({ rank: 2, file: 3 });
      });

      test("should default to black behavior for undefined player color", () => {
        const result = transformCoordinatesForPlayer(2, 3, undefined);
        expect(result).toEqual({ rank: 2, file: 3 });
      });

      test("should default to black behavior for invalid player color", () => {
        const result = transformCoordinatesForPlayer(2, 3, "invalid");
        expect(result).toEqual({ rank: 2, file: 3 });
      });
    });

    describe("boundary validation", () => {
      test("should handle minimum coordinates for black player", () => {
        const result = transformCoordinatesForPlayer(0, 0, "black");
        expect(result).toEqual({ rank: 0, file: 0 });
      });

      test("should handle maximum coordinates for white player", () => {
        const result = transformCoordinatesForPlayer(7, 7, "white");
        expect(result).toEqual({ rank: 0, file: 0 });
      });
    });
  });
});
