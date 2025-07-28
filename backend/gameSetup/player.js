/**
 * Represents a player in the chess game
 */
export default class Player {
  /**
   * Creates a new player instance
   * @param {string} username - The player's chosen username
   * @param {string} socketID - Unique socket identifier for this player's connection
   * @param {string|null} colour - Chess piece color ('black' or 'white'), defaults to null
   */
  constructor(username, socketID, colour = null) {
    //store player's username for display and identification
    this.username = username;
    //socket id links this player to their websocket connection
    this.socketID = socketID;
    //chess piece color - black goes first, white goes second
    this.colour = colour;
  }

  /**
   * Assigns a chess piece color to this player
   * @param {string} colour - The color to assign ('black' or 'white')
   */
  //assign a color to this player
  setColour(colour) {
    this.colour = colour;
  }
}
