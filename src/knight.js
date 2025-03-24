import ChessPiece from "./ChessPiece.js";

export default class Knight extends ChessPiece {
  constructor(colour, position) {
    super("knight", colour, position);
  }
}
