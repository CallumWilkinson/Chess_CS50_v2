import MoveValidation from "../../../backend/gameLogic/moveValidation.js";
import Board from "../../../backend/gameLogic/board.js";
import Rook from "../../../backend/chessPieces/rook.js";
import Position from "../../../backend/gameLogic/position.js";

describe("MoveValidation", () => {
  let board;
  let rook;
  let validator;

  beforeEach(() => {
    board = new Board();
    board.createEmptyBoard();
    rook = new Rook("white", new Position("e4"));
    validator = new MoveValidation(board, rook);
  });

  describe("movement pattern validators", () => {
    describe("isSameRank", () => {
      it("returns true for same rank", () => {
        expect(validator.isSameRank("a4")).toBe(true);
        expect(validator.isSameRank("h4")).toBe(true);
      });

      it("returns false for different rank", () => {
        expect(validator.isSameRank("e5")).toBe(false);
        expect(validator.isSameRank("e3")).toBe(false);
      });
    });

    describe("isSameFile", () => {
      it("returns true for same file", () => {
        expect(validator.isSameFile("e1")).toBe(true);
        expect(validator.isSameFile("e8")).toBe(true);
      });

      it("returns false for different file", () => {
        expect(validator.isSameFile("d4")).toBe(false);
        expect(validator.isSameFile("f4")).toBe(false);
      });
    });

    describe("isRookMove", () => {
      it("returns true for horizontal moves", () => {
        expect(validator.isRookMove("a4")).toBe(true);
        expect(validator.isRookMove("h4")).toBe(true);
      });

      it("returns true for vertical moves", () => {
        expect(validator.isRookMove("e1")).toBe(true);
        expect(validator.isRookMove("e8")).toBe(true);
      });

      it("returns false for diagonal moves", () => {
        expect(validator.isRookMove("f5")).toBe(false);
        expect(validator.isRookMove("d3")).toBe(false);
      });
    });

    describe("isDiagonalMove", () => {
      it("returns true for diagonal moves", () => {
        expect(validator.isDiagonalMove("f5")).toBe(true);
        expect(validator.isDiagonalMove("d3")).toBe(true);
        expect(validator.isDiagonalMove("g6")).toBe(true);
        expect(validator.isDiagonalMove("c2")).toBe(true);
      });

      it("returns false for non-diagonal moves", () => {
        expect(validator.isDiagonalMove("e5")).toBe(false);
        expect(validator.isDiagonalMove("f4")).toBe(false);
        expect(validator.isDiagonalMove("g7")).toBe(false);
      });
    });

    describe("isQueenMove", () => {
      it("returns true for rook-like moves", () => {
        expect(validator.isQueenMove("e8")).toBe(true);
        expect(validator.isQueenMove("a4")).toBe(true);
      });

      it("returns true for bishop-like moves", () => {
        expect(validator.isQueenMove("f5")).toBe(true);
        expect(validator.isQueenMove("d3")).toBe(true);
      });

      it("returns false for knight moves", () => {
        expect(validator.isQueenMove("f6")).toBe(false);
        expect(validator.isQueenMove("d6")).toBe(false);
      });
    });

    describe("isKingMove", () => {
      it("returns true for adjacent squares", () => {
        expect(validator.isKingMove("e5")).toBe(true);
        expect(validator.isKingMove("f4")).toBe(true);
        expect(validator.isKingMove("d3")).toBe(true);
      });

      it("returns false for distant squares", () => {
        expect(validator.isKingMove("e6")).toBe(false);
        expect(validator.isKingMove("g4")).toBe(false);
      });
    });

    describe("isKnightMove", () => {
      it("returns true for L-shaped moves", () => {
        expect(validator.isKnightMove("f6")).toBe(true);
        expect(validator.isKnightMove("d6")).toBe(true);
        expect(validator.isKnightMove("g5")).toBe(true);
        expect(validator.isKnightMove("c5")).toBe(true);
        expect(validator.isKnightMove("g3")).toBe(true);
        expect(validator.isKnightMove("c3")).toBe(true);
        expect(validator.isKnightMove("f2")).toBe(true);
        expect(validator.isKnightMove("d2")).toBe(true);
      });

      it("returns false for non-knight moves", () => {
        expect(validator.isKnightMove("e5")).toBe(false);
        expect(validator.isKnightMove("f5")).toBe(false);
        expect(validator.isKnightMove("e6")).toBe(false);
      });
    });
  });

  describe("integration with existing pieces", () => {
    it("works with real rook getPossibleMoves method", () => {
      const moves = rook.getPossibleMoves(board);
      
      expect(moves).toContain("e5");
      expect(moves).toContain("a4");
      expect(moves).toContain("h4");
      expect(moves).not.toContain("f5");
    });
  });
});