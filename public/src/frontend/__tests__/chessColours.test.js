import {
  normalizeChessColour,
  getOppositeColour,
  formatColourLabel,
} from "../shared/utilities/chessColours.js";

describe("normalizeChessColour", () => {
  test("returns lowercase colour when valid", () => {
    expect(normalizeChessColour(" White ")).toBe("white");
    expect(normalizeChessColour("BLACK")).toBe("black");
  });

  test("returns null for invalid values", () => {
    expect(normalizeChessColour("purple")).toBeNull();
    expect(normalizeChessColour(null)).toBeNull();
    expect(normalizeChessColour(undefined)).toBeNull();
  });
});

describe("getOppositeColour", () => {
  test("returns opposite colour for white and black", () => {
    expect(getOppositeColour("white")).toBe("black");
    expect(getOppositeColour("black")).toBe("white");
  });

  test("returns null when colour is unknown", () => {
    expect(getOppositeColour("purple")).toBeNull();
    expect(getOppositeColour(null)).toBeNull();
  });
});

describe("formatColourLabel", () => {
  test("formats lowercase label to title case", () => {
    expect(formatColourLabel("white")).toBe("White");
    expect(formatColourLabel("black")).toBe("Black");
  });

  test("returns empty string for unknown input", () => {
    expect(formatColourLabel("purple")).toBe("");
    expect(formatColourLabel(null)).toBe("");
  });
});