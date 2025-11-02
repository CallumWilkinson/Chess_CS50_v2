import getClickedSquareName from "../../../public/src/frontend/interaction/board/getClickedSquareName.js";
import { squareToCanvasCoordinates } from "../../../public/src/frontend/domain/board/coordinates.js";
import { UIConstants } from "../../../shared/utilities/constants.js";

// Mock canvas and mouse event for testing
function createMockCanvas() {
  return {
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
    }),
  };
}

function createMockMouseEvent(x, y) {
  return {
    clientX: x,
    clientY: y,
  };
}

describe("Click Coordinate Transformation", () => {
  describe("getClickedSquareName", () => {
    const mockCanvas = createMockCanvas();

    describe("black player perspective (no transformation)", () => {
      test("should correctly identify top-left square (a1) for black player", () => {
        const event = createMockMouseEvent(
          UIConstants.TILESIZE / 2,
          UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "black");
        expect(result).toBe("a1");
      });

      test("should correctly identify bottom-right square (h8) for black player", () => {
        const event = createMockMouseEvent(
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "black");
        expect(result).toBe("h8");
      });

      test("should correctly identify center squares for black player", () => {
        const event = createMockMouseEvent(
          4 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          3 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "black");
        expect(result).toBe("e4");
      });
    });

    describe("white player perspective (transformed coordinates)", () => {
      test("should correctly identify logical square when white player clicks bottom-right", () => {
        // White player sees board flipped, so clicking bottom-right gives them a square from their perspective
        const event = createMockMouseEvent(
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "white");
        expect(result).toBe("a1"); // This is what they should get after transformation
      });

      test("should correctly identify logical square when white player clicks top-left", () => {
        // White player sees board flipped, so clicking top-left gives them the flipped equivalent
        const event = createMockMouseEvent(
          UIConstants.TILESIZE / 2,
          UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "white");
        expect(result).toBe("h8"); // This is what they should get after transformation
      });

      test("should correctly identify center squares for white player", () => {
        // White player clicking e4 position should get the transformed square
        const event = createMockMouseEvent(
          4 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          3 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        const result = getClickedSquareName(event, mockCanvas, "white");
        expect(result).toBe("d5"); // Transformed center square
      });

      test("should handle white player edge cases", () => {
        // Test a few more squares to ensure transformation is working correctly
        const topRightClick = createMockMouseEvent(
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          UIConstants.TILESIZE / 2
        );
        expect(getClickedSquareName(topRightClick, mockCanvas, "white")).toBe(
          "a8"
        );

        const bottomLeftClick = createMockMouseEvent(
          UIConstants.TILESIZE / 2,
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        expect(getClickedSquareName(bottomLeftClick, mockCanvas, "white")).toBe(
          "h1"
        );
      });
    });

    describe("edge cases", () => {
      test("should handle null/undefined player color as black", () => {
        const event = createMockMouseEvent(
          UIConstants.TILESIZE / 2,
          UIConstants.TILESIZE / 2
        );
        expect(getClickedSquareName(event, mockCanvas, null)).toBe("a1");
        expect(getClickedSquareName(event, mockCanvas, undefined)).toBe("a1");
      });

      test("should handle invalid player color as black", () => {
        const event = createMockMouseEvent(
          UIConstants.TILESIZE / 2,
          UIConstants.TILESIZE / 2
        );
        expect(getClickedSquareName(event, mockCanvas, "invalid")).toBe("a1");
      });
    });
  });

  describe("squareToCanvasCoordinates", () => {
    describe("black player perspective (no transformation)", () => {
      test("should convert a1 to top-left canvas coordinates for black player", () => {
        const result = squareToCanvasCoordinates("a1", "black");
        expect(result).toEqual({
          x: UIConstants.TILESIZE / 2,
          y: UIConstants.TILESIZE / 2,
        });
      });

      test("should convert h8 to bottom-right canvas coordinates for black player", () => {
        const result = squareToCanvasCoordinates("h8", "black");
        expect(result).toEqual({
          x: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        });
      });

      test("should convert e4 to center coordinates for black player", () => {
        const result = squareToCanvasCoordinates("e4", "black");
        expect(result).toEqual({
          x: 4 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          y: 3 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        });
      });
    });

    describe("white player perspective (transformed coordinates)", () => {
      test("should convert a8 to transformed canvas coordinates for white player", () => {
        const result = squareToCanvasCoordinates("a8", "white");
        expect(result).toEqual({
          x: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          y: UIConstants.TILESIZE / 2,
        });
      });

      test("should convert h1 to transformed canvas coordinates for white player", () => {
        const result = squareToCanvasCoordinates("h1", "white");
        expect(result).toEqual({
          x: UIConstants.TILESIZE / 2,
          y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        });
      });

      test("should convert e4 to transformed center coordinates for white player", () => {
        const result = squareToCanvasCoordinates("e4", "white");
        expect(result).toEqual({
          x: 3 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
          y: 4 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        });
      });
    });

    describe("default parameter behavior", () => {
      test("should default to black player behavior when no color specified", () => {
        const blackResult = squareToCanvasCoordinates("a8", "black");
        const defaultResult = squareToCanvasCoordinates("a8");
        expect(defaultResult).toEqual(blackResult);
      });
    });
  });

  describe("coordinate transformation consistency", () => {
    test("should provide symmetrical transformation for click detection and canvas positioning", () => {
      const testSquares = ["a8", "h1", "e4", "d5", "a1", "h8"];

      testSquares.forEach((square) => {
        // Test both black and white perspectives
        ["black", "white"].forEach((playerColour) => {
          // Get canvas coordinates for the square
          const canvasCoords = squareToCanvasCoordinates(square, playerColour);

          // Simulate a click at those coordinates
          const mockEvent = createMockMouseEvent(
            canvasCoords.x,
            canvasCoords.y
          );
          const clickedSquare = getClickedSquareName(
            mockEvent,
            createMockCanvas(),
            playerColour
          );

          // Should get back the same square
          expect(clickedSquare).toBe(square);
        });
      });
    });

    test("should handle board boundaries correctly for both perspectives", () => {
      const corners = [
        { square: "a8", blackCoords: [0, 7], whiteCoords: [7, 0] },
        { square: "a1", blackCoords: [0, 0], whiteCoords: [7, 7] },
        { square: "h8", blackCoords: [7, 7], whiteCoords: [0, 0] },
        { square: "h1", blackCoords: [7, 0], whiteCoords: [0, 7] },
      ];

      corners.forEach(({ square, blackCoords, whiteCoords }) => {
        // Test black perspective
        const blackCanvasCoords = squareToCanvasCoordinates(square, "black");
        expect(blackCanvasCoords.x).toBe(
          blackCoords[0] * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        expect(blackCanvasCoords.y).toBe(
          blackCoords[1] * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );

        // Test white perspective
        const whiteCanvasCoords = squareToCanvasCoordinates(square, "white");
        expect(whiteCanvasCoords.x).toBe(
          whiteCoords[0] * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
        expect(whiteCanvasCoords.y).toBe(
          whiteCoords[1] * UIConstants.TILESIZE + UIConstants.TILESIZE / 2
        );
      });
    });
  });
});
