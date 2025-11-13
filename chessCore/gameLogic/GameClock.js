import { ChessConstants } from "../../shared/utilities/gameConstants.js";

/**
 * Clock responsible for managing time for each player
 * Each player starts with 3 mins each
 * When your timer ends, you loose the game
 */

export default class GameClock {
  constructor() {
    this.blackTimeRemaining = ChessConstants.TOTAL_MILLISECONDS_PER_PLAYER;
    this.whiteTimeRemaining = ChessConstants.TOTAL_MILLISECONDS_PER_PLAYER;
  }
}
