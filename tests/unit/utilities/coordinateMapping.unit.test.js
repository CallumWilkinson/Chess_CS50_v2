import {
  squareToPixelCoordinates,
  squareToPieceCenterCoordinates,
  getRankLabelCoordinates,
  getFileLabelCoordinates,
} from "../../../public/src/frontend/coordinateMapping.js";
import { UIConstants } from "../../../shared/utilities/constants.js";

describe("Coordinate Mapping Utilities", () => {
  describe("squareToPixelCoordinates", () => {
    test("should convert top-left corner coordinates (a8)", () => {
      const result = squareToPixelCoordinates(0, 0);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    test("should convert bottom-right corner coordinates (h1)", () => {
      const result = squareToPixelCoordinates(7, 7);
      expect(result).toEqual({
        x: 7 * UIConstants.TILESIZE,
        y: 7 * UIConstants.TILESIZE,
      });
    });

    test("should convert middle square coordinates (d4)", () => {
      const result = squareToPixelCoordinates(3, 4);
      expect(result).toEqual({
        x: 3 * UIConstants.TILESIZE,
        y: 4 * UIConstants.TILESIZE,
      });
    });

    test("should handle edge cases", () => {
      const topRight = squareToPixelCoordinates(7, 0);
      expect(topRight).toEqual({ x: 7 * UIConstants.TILESIZE, y: 0 });

      const bottomLeft = squareToPixelCoordinates(0, 7);
      expect(bottomLeft).toEqual({ x: 0, y: 7 * UIConstants.TILESIZE });
    });
  });

  describe("squareToPieceCenterCoordinates", () => {
    test("should convert coordinates to piece center for top-left corner", () => {
      const result = squareToPieceCenterCoordinates(0, 0);
      expect(result).toEqual({
        x: UIConstants.TILESIZE / 2,
        y: UIConstants.TILESIZE / 2,
      });
    });

    test("should convert coordinates to piece center for bottom-right corner", () => {
      const result = squareToPieceCenterCoordinates(7, 7);
      expect(result).toEqual({
        x: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
      });
    });

    test("should convert coordinates to piece center for middle square", () => {
      const result = squareToPieceCenterCoordinates(3, 4);
      expect(result).toEqual({
        x: 3 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        y: 4 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
      });
    });

    test("should handle edge cases for piece center", () => {
      const topRight = squareToPieceCenterCoordinates(7, 0);
      expect(topRight).toEqual({
        x: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
        y: UIConstants.TILESIZE / 2,
      });

      const bottomLeft = squareToPieceCenterCoordinates(0, 7);
      expect(bottomLeft).toEqual({
        x: UIConstants.TILESIZE / 2,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE / 2,
      });
    });
  });

  describe("getRankLabelCoordinates", () => {
    test("should calculate rank label position for top rank (rank 0)", () => {
      const result = getRankLabelCoordinates(0);
      expect(result).toEqual({
        x: 5,
        y: UIConstants.TILESIZE * 0.7,
      });
    });

    test("should calculate rank label position for bottom rank (rank 7)", () => {
      const result = getRankLabelCoordinates(7);
      expect(result).toEqual({
        x: 5,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.7,
      });
    });

    test("should calculate rank label position for middle rank", () => {
      const result = getRankLabelCoordinates(3);
      expect(result).toEqual({
        x: 5,
        y: 3 * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.7,
      });
    });

    test("should handle all rank indices consistently", () => {
      for (let rank = 0; rank < 8; rank++) {
        const result = getRankLabelCoordinates(rank);
        expect(result.x).toBe(5);
        expect(result.y).toBe(
          rank * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.7
        );
      }
    });
  });

  describe("getFileLabelCoordinates", () => {
    test("should calculate file label position for leftmost file (file 0)", () => {
      const result = getFileLabelCoordinates(0);
      expect(result).toEqual({
        x: UIConstants.TILESIZE * 0.75,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE - 5,
      });
    });

    test("should calculate file label position for rightmost file (file 7)", () => {
      const result = getFileLabelCoordinates(7);
      expect(result).toEqual({
        x: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.75,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE - 5,
      });
    });

    test("should calculate file label position for middle file", () => {
      const result = getFileLabelCoordinates(3);
      expect(result).toEqual({
        x: 3 * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.75,
        y: 7 * UIConstants.TILESIZE + UIConstants.TILESIZE - 5,
      });
    });

    test("should handle all file indices consistently", () => {
      for (let file = 0; file < 8; file++) {
        const result = getFileLabelCoordinates(file);
        expect(result.x).toBe(
          file * UIConstants.TILESIZE + UIConstants.TILESIZE * 0.75
        );
        expect(result.y).toBe(
          7 * UIConstants.TILESIZE + UIConstants.TILESIZE - 5
        );
      }
    });
  });

  describe("coordinate mapping integration", () => {
    test("should provide consistent coordinate systems between functions", () => {
      const fileIndex = 3;
      const rankIndex = 4;

      const pixelCoords = squareToPixelCoordinates(fileIndex, rankIndex);
      const centerCoords = squareToPieceCenterCoordinates(fileIndex, rankIndex);

      // Center coordinates should be pixel coordinates + half tile size
      expect(centerCoords.x).toBe(pixelCoords.x + UIConstants.TILESIZE / 2);
      expect(centerCoords.y).toBe(pixelCoords.y + UIConstants.TILESIZE / 2);
    });

    test("should maintain proper spacing between squares", () => {
      const square1 = squareToPixelCoordinates(0, 0);
      const square2 = squareToPixelCoordinates(1, 0);
      const square3 = squareToPixelCoordinates(0, 1);

      // Adjacent squares should be one TILESIZE apart
      expect(square2.x - square1.x).toBe(UIConstants.TILESIZE);
      expect(square2.y - square1.y).toBe(0);

      expect(square3.x - square1.x).toBe(0);
      expect(square3.y - square1.y).toBe(UIConstants.TILESIZE);
    });
  });

  describe("boundary conditions", () => {
    test("should handle minimum coordinate values", () => {
      const minPixel = squareToPixelCoordinates(0, 0);
      const minCenter = squareToPieceCenterCoordinates(0, 0);
      const minRankLabel = getRankLabelCoordinates(0);
      const minFileLabel = getFileLabelCoordinates(0);

      expect(minPixel.x).toBe(0);
      expect(minPixel.y).toBe(0);
      expect(minCenter.x).toBeGreaterThan(0);
      expect(minCenter.y).toBeGreaterThan(0);
      expect(minRankLabel.x).toBeGreaterThan(0);
      expect(minRankLabel.y).toBeGreaterThan(0);
      expect(minFileLabel.x).toBeGreaterThan(0);
      expect(minFileLabel.y).toBeGreaterThan(0);
    });

    test("should handle maximum coordinate values", () => {
      const maxPixel = squareToPixelCoordinates(7, 7);
      const maxCenter = squareToPieceCenterCoordinates(7, 7);
      const maxRankLabel = getRankLabelCoordinates(7);
      const maxFileLabel = getFileLabelCoordinates(7);

      expect(maxPixel.x).toBe(7 * UIConstants.TILESIZE);
      expect(maxPixel.y).toBe(7 * UIConstants.TILESIZE);
      expect(maxCenter.x).toBeGreaterThan(maxPixel.x);
      expect(maxCenter.y).toBeGreaterThan(maxPixel.y);
      expect(maxRankLabel.y).toBeGreaterThan(maxPixel.y);
      expect(maxFileLabel.x).toBeGreaterThan(maxPixel.x);
    });
  });
});
