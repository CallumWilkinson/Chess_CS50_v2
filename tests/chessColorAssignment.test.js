import { jest } from "@jest/globals";
import { assignChessColor } from "../backend/gameLogic/chessColorAssignment.js";

//test suite for chess-specific color assignment logic
describe("assignChessColor function", () => {

  //test basic color assignment rules
  describe("basic color assignment", () => {
    test("returns black when no players exist", () => {
      const players = {};
      
      const result = assignChessColor(players);
      
      expect(result).toBe("black");
    });

    test("returns white when black player already exists", () => {
      const players = {
        socket1: { colour: "black" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe("white");
    });

    test("returns black when only white player exists", () => {
      const players = {
        socket1: { colour: "white" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe("black");
    });

    test("returns null when both colors exist (game is full)", () => {
      const players = {
        socket1: { colour: "black" },
        socket2: { colour: "white" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe(null);
    });
  });

  //test edge cases and error handling
  describe("edge cases and error handling", () => {
    test("handles empty players object", () => {
      const result = assignChessColor({});
      
      expect(result).toBe("black");
    });

    test("handles null players gracefully", () => {
      const result = assignChessColor(null);
      
      expect(result).toBe("black");
    });

    test("handles undefined players gracefully", () => {
      const result = assignChessColor(undefined);
      
      expect(result).toBe("black");
    });
  });

  //test game full detection
  describe("full game detection", () => {
    test("returns null when game has maximum players (2)", () => {
      const players = {
        socket1: { colour: "black" },
        socket2: { colour: "white" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe(null);
    });

    test("returns null regardless of color order when both exist", () => {
      //test with white first, black second
      const players = {
        socket1: { colour: "white" },
        socket2: { colour: "black" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe(null);
    });
  });

  //test chess-specific behavior
  describe("chess-specific behavior", () => {
    test("follows chess convention: first player gets black", () => {
      //empty game should assign black to first player
      const result = assignChessColor({});
      
      expect(result).toBe("black");
    });

    test("follows chess convention: second player gets white", () => {
      //game with one black player should assign white to second player
      const players = { 
        socket1: { colour: "black" }
      };
      
      const result = assignChessColor(players);
      
      expect(result).toBe("white");
    });
  });
});