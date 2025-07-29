import { toSquareNotation, getFileIndex, getRankIndex, isLightSquare } from "../../../shared/utilities/toSquareNotation.js";

describe("Chess coordinate utilities", () => {
  
  describe("getFileIndex", () => {
    test("converts file letters to indices", () => {
      expect(getFileIndex("a1")).toBe(0);
      expect(getFileIndex("b1")).toBe(1);
      expect(getFileIndex("h1")).toBe(7);
      expect(getFileIndex("e4")).toBe(4);
    });
  });

  describe("getRankIndex", () => {
    test("converts rank numbers to indices", () => {
      expect(getRankIndex("a1")).toBe(0);
      expect(getRankIndex("a2")).toBe(1);
      expect(getRankIndex("a8")).toBe(7);
      expect(getRankIndex("e4")).toBe(3);
    });
  });

  describe("isLightSquare", () => {
    test("identifies light squares correctly", () => {
      expect(isLightSquare("a1")).toBe(true);  // 0+0 = 0 (even)
      expect(isLightSquare("b1")).toBe(false); // 1+0 = 1 (odd)
      expect(isLightSquare("a2")).toBe(false); // 0+1 = 1 (odd)
      expect(isLightSquare("b2")).toBe(true);  // 1+1 = 2 (even)
      expect(isLightSquare("h8")).toBe(true);  // 7+7 = 14 (even)
    });
  });

  describe("toSquareNotation (existing function)", () => {
    test("converts indices back to square notation", () => {
      expect(toSquareNotation(0, 0)).toBe("a1");
      expect(toSquareNotation(4, 3)).toBe("e4");
      expect(toSquareNotation(7, 7)).toBe("h8");
    });
  });
});